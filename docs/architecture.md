# 系統架構

## 總覽

本專案由兩個獨立部署的元件組成：部署在 GitHub Pages 的 React 靜態網站，以及在 Cloudflare Edge 執行 RAG + LLM 串流的 Cloudflare Worker。

```mermaid
graph TB
    subgraph Browser["瀏覽器"]
        UI["React App\n(GitHub Pages)"]
        Widget["FloatingChatWidget"]
        Hook["useStreamingChat hook"]
        UI --> Widget --> Hook
    end

    subgraph CF["Cloudflare Edge"]
        Worker["Worker: portfolio-rag\nPOST /query"]
        Cache["caches.default\nkey = sha256(query)"]
        AI["Workers AI"]
        VZ["Vectorize\nportfolio-index"]

        Worker -- "快取檢查" --> Cache
        Worker -- "embed (@cf/baai/bge-m3)" --> AI
        Worker -- "query topK=5" --> VZ
        Worker -- "stream (@cf/meta/llama-3-8b-instruct)" --> AI
    end

    Hook -- "POST /query" --> Worker
    Worker -- "ReadableStream (SSE)" --> Hook
```

---

## 前端架構

### 元件樹

```mermaid
graph TD
    App["App.js\n載入資料、設定 Router"]

    App --> Router["HashRouter"]
    Router --> Header
    Router --> FloatingChatWidget
    Router --> Routes

    Routes --> Home["/ 首頁"]
    Routes --> Projects["/projects 所有專案"]
    Routes --> ProjectDetail["/projects/:id 專案詳情"]
    Routes --> WorkDetail["/works/:id 工作詳情"]

    Home --> LandingSection["Hero 區塊"]
    Home --> ProjectsCarousel["精選專案輪播"]
    Home --> WorksSummary["工作經歷"]
    Home --> SkillSection["技能"]
    Home --> EducationSection["學歷"]
    Home --> ContactMeSection["聯絡表單"]
    Home --> Footer

    FloatingChatWidget --> useStreamingChat["useStreamingChat (hook)"]
    ContactMeSection --> useSubmit["useSubmit (hook)"]
```

### 資料流

```mermaid
sequenceDiagram
    participant App
    participant JSON as public/data/*.json
    participant Components as 子元件

    App->>JSON: axios.get（mount 時並行請求）
    JSON-->>App: profile, projects, works, skills, education
    App->>App: 正規化並合併至 state
    App->>Components: 以 props 傳遞
```

### 路由規則

使用 `HashRouter`（`/#/` 形式），無需伺服器端路由設定，完全相容 GitHub Pages 靜態托管。

| 路徑 | 元件 |
|------|------|
| `/` | 主頁 |
| `/projects` | 所有專案格狀列表 |
| `/projects/:id` | 專案詳情頁 |
| `/works/:id` | 工作經歷詳情頁 |

---

## 後端架構（Cloudflare Worker）

### RAG Pipeline

```mermaid
flowchart TD
    Q["使用者輸入 Query"] --> CORS["CORS + OPTIONS 檢查"]
    CORS --> CACHE{"快取命中？\nsha256(query)"}

    CACHE -- "HIT" --> CACHED["直接回傳快取 SSE stream"]

    CACHE -- "MISS" --> EMBED["1. 向量化 query\n@cf/baai/bge-m3\n→ float32[1024]"]
    EMBED --> SEARCH["2. 向量搜尋\nVectorize.query(topK=5)\n→ 前 5 筆相關 chunk"]
    SEARCH --> PROMPT["3. 組裝 prompt\nsystem + context + query"]
    PROMPT --> LLM["4. 串流 LLM\n@cf/meta/llama-3-8b-instruct\nstream: true"]
    LLM --> TEE["5. Tee stream"]
    TEE --> CLIENT["回傳 ReadableStream\n給前端（SSE 格式）"]
    TEE --> STORE["背景快取\nwaitUntil()"]
```

### 串流協定

```mermaid
sequenceDiagram
    participant FE as 前端 (useStreamingChat)
    participant W as Worker
    participant LLM as Workers AI (LLM)

    FE->>W: POST /query { query: "..." }
    W->>LLM: run(llama-3-8b, { stream: true })
    loop 逐 token 串流
        LLM-->>W: data: {"response":"token"}\n\n
        W-->>FE: data: {"response":"token"}\n\n
        FE->>FE: 將 token 附加至訊息 state
    end
    LLM-->>W: data: [DONE]
    W-->>FE: data: [DONE]
    FE->>FE: isStreaming = false
```

---

## 資料與 Vectorize

### Ingest Pipeline（首次設定 / 資料更新時手動執行）

```mermaid
flowchart LR
    subgraph Source["public/data/（資料來源）"]
        P["profile.json"]
        PR["projects.json"]
        W["works.json"]
        S["skills.json"]
    end

    subgraph Script["worker/scripts/ingest.js"]
        CHUNK["產生文字 chunk\ntitle + tags + description"]
        EMBED["透過 REST API 向量化\n@cf/baai/bge-m3"]
        UPSERT["以 NDJSON 格式 upsert\n至 Vectorize"]
    end

    subgraph VZ["Cloudflare Vectorize（向量資料庫）"]
        IDX["portfolio-index\ndimensions: 1024\nmetric: cosine"]
    end

    P & PR & W & S --> CHUNK --> EMBED --> UPSERT --> IDX
```

### 向量 ID 命名規則

| 來源 | Vector ID |
|------|-----------|
| `projects.json` 各項目 | `project-{id}` |
| `works.json` 各項目 | `work-{id}` |
| `skills.json` | `skills` |
| `profile.json` | `profile` |

每個向量的 metadata 儲存 `{ text, type }`，供 Worker 在查詢時取出原始文字作為 context。

詳細同步流程請參閱 [RAG_SYNC_GUIDE.md](./RAG_SYNC_GUIDE.md)。

---

## 部署流程

```mermaid
flowchart LR
    subgraph Dev["本機開發"]
        CODE["程式碼異動"]
        INGEST["node scripts/ingest.js\n（資料更新時執行）"]
        WDEPLOY["wrangler deploy\n（Worker 異動時執行）"]
    end

    subgraph CI["GitHub Actions 自動化"]
        PUSH["push to main"]
        BUILD["npm run build\n注入 REACT_APP_WORKER_URL secret"]
        GHPAGES["gh-pages branch"]
    end

    subgraph Prod["正式環境"]
        GHP["GitHub Pages\na920604a.github.io/..."]
        CFW["Cloudflare Worker\nportfolio-rag.*.workers.dev"]
        VZI["Cloudflare Vectorize\nportfolio-index"]
    end

    CODE --> PUSH --> BUILD --> GHPAGES --> GHP
    WDEPLOY --> CFW
    INGEST --> VZI
```

### 環境變數

| 變數 | 使用位置 | 用途 |
|------|---------|------|
| `REACT_APP_WORKER_URL` | GitHub Secret + `.env` | Worker URL，在 build 時打包進 React |
| `CLOUDFLARE_API_TOKEN` | 本機 shell | ingest.js — 向量化 + upsert 到 Vectorize |
| `CLOUDFLARE_ACCOUNT_ID` | 本機 shell | ingest.js — Cloudflare REST API 呼叫 |

---

## 關鍵設計決策

**HashRouter 而非 BrowserRouter** — GitHub Pages 只提供單一 HTML 檔；hash 路由避免直接訪問子路徑時出現 404，無需伺服器端設定。

**Cloudflare Workers 而非傳統伺服器** — 零冷啟動延遲、全球邊緣分散式執行，Vectorize 與 Workers AI 同在 Cloudflare 平台，向量化與搜尋的網路往返延遲極低。

**SSE 而非 WebSocket** — LLM token 串流只需伺服器→客戶端單向推送；SSE 是 HTTP 原生協定，透過標準 `fetch()` + `ReadableStream` 即可使用，不需額外協定開銷。

**Stream tee 快取** — LLM stream 被 tee 成兩份：一份立即回傳給客戶端保持串流體驗，另一份在背景以 `waitUntil()` 存入 `caches.default`，cache miss 時不增加任何延遲。

**`public/data/*.json` 作為唯一資料來源** — 相同的 JSON 檔案同時驅動前端 UI 與 RAG 知識庫，不存在內容重複或 UI 與 AI 之間的同步落差。

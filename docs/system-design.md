# 系統設計文件

> 本文件以教學為目的，說明 **Self-Resume Website** 的整體架構、各子系統設計決策與實作細節。  
> 適合用於技術分享、面試準備、或 Fork 後二次開發的參考。

---

## 目錄

1. [系統全貌](#1-系統全貌)
2. [前端架構](#2-前端架構)
3. [後端架構（Cloudflare Worker）](#3-後端架構cloudflare-worker)
4. [AI Pipeline 設計](#4-ai-pipeline-設計)
5. [串流協定（SSE）](#5-串流協定sse)
6. [資料層與 Vectorize](#6-資料層與-vectorize)
7. [存取控制](#7-存取控制)
8. [Rate Limiting](#8-rate-limiting)
9. [部署流程](#9-部署流程)
10. [關鍵設計決策 Q&A](#10-關鍵設計決策-qa)

---

## 1. 系統全貌

本專案由兩個**獨立部署**的元件組成：

```
┌─────────────────────────────────────────────────────────┐
│  瀏覽器（GitHub Pages）                                   │
│                                                         │
│  React SPA  ──── fetch / SSE ────►  Cloudflare Worker  │
│  (靜態檔案)                          (Edge Runtime)      │
└─────────────────────────────────────────────────────────┘
```

| 元件 | 平台 | 說明 |
|------|------|------|
| 前端 | GitHub Pages | React 18 靜態網站，BrowserRouter 路由 |
| 後端 | Cloudflare Workers | AI pipeline，Edge 執行，無伺服器 |
| 向量資料庫 | Cloudflare Vectorize | 個人資料的語意搜尋索引 |
| LLM / Embedding | Cloudflare Workers AI | 多模型，按任務分層選用 |
| 限流狀態 | Cloudflare KV | 各 IP 的請求計數 |

### 整體架構圖

```
Browser (GitHub Pages)
│
├── FloatingChatWidget  ──POST /query──────────────────────┐
├── JDAnalyzer          ──POST /analyze-jd─────────────────┤
└── WorkspacePage (PIN) ──POST /match-jd──────────────────►│
                         ──POST /apply-resume / apply-cover─┤  Cloudflare Worker
                         ──POST /health-check───────────────┤
                                                            │
                                          ┌─────────────────┤
                                          │  rateLimiter.js │
                                          │  (KV 計數)      │
                                          └─────────────────┤
                                          ┌─────────────────┤
                                          │  Vectorize      │
                                          │  (bge-m3 1024d) │
                                          └─────────────────┤
                                          ┌─────────────────┤
                                          │  Workers AI     │
                                          │  3B / 8B / 70B  │
                                          └─────────────────┘
```

---

## 2. 前端架構

### 2.1 路由結構

```
/                    → 主頁（Hero / Skills / Works / Projects / Education / Contact）
/projects            → 專案列表
/projects/:id        → 專案詳情
/works/:id           → 工作詳情
/ai-lab              → AI 工具入口頁
/jd-analyzer         → JD Analyzer（公開）
/ai-lab/workspace    → Workspace（PIN 保護）
```

前端使用 `BrowserRouter`，部署在 GitHub Pages 時需要 `404.html` redirect trick 處理 deep link。

### 2.2 元件樹

```
App.js
├── LocaleProvider（i18n context）
├── Header（語言切換、導覽）
├── FloatingChatWidget（懸浮 AI 對話）
└── Routes
    ├── /              → 主頁 sections
    ├── /ai-lab        → AILabPage
    ├── /jd-analyzer   → JDAnalyzer
    └── /workspace     → PinGate → WorkspacePage
                                   ├── Tab: Job Wizard
                                   │   ├── Step1: JD Match
                                   │   ├── Step2: Apply（Resume + Cover Letter）
                                   │   └── Step3: Release（ZIP 下載）
                                   └── Tab: Resume Health Check
```

### 2.3 Hooks 設計

每個 AI 功能對應一個自訂 Hook，負責：
- 管理 loading / streaming / error 狀態
- 發送 fetch 請求並解析 SSE stream
- 提供 `stop()` / `reset()` 控制介面

| Hook | Endpoint | 說明 |
|------|----------|------|
| `useStreamingChat` | `POST /query` | Chat RAG，history 存 localStorage |
| `useJDAnalysis` | `POST /analyze-jd` | JD Analyzer 串流 |
| `useJDMatch` | `POST /match-jd` | Job Wizard Step1 |
| `useJobApply` | `POST /apply-resume` + `POST /apply-cover` | Step2，兩個並行 fetch |
| `useHealthCheck` | `POST /health-check` | 雙階段 SSE（scores + 串流建議）|

### 2.4 i18n

```
LocaleContext → { locale, setLocale, t }
src/i18n/en.js
src/i18n/zh.js
```

語言切換只影響 UI 文字，AI 回應語言跟隨 JD 輸入語言（prompt 層控制）。

---

## 3. 後端架構（Cloudflare Worker）

### 3.1 Worker 入口（index.js）

```
fetch(request, env, ctx)
  │
  ├── CORS preflight (OPTIONS) → 204
  ├── 非 POST → 405
  └── 路由分派
      ├── /query          → handleQuery
      ├── /analyze-jd     → handleJDAnalysis
      ├── /match-jd       → handleJDMatch
      ├── /apply-resume   → handleJobResume
      ├── /apply-cover    → handleJobCover
      └── /health-check   → handleHealthCheck
```

每個 handler 的共同結構：

```
1. 解析 JSON body
2. 驗證必要欄位
3. checkRateLimit(kv, ip, RATE_LIMITS.xxx)
4. 業務邏輯（RAG / fetch JSON / 組裝 prompt）
5. env.AI.run(MODEL, { messages, stream, max_tokens })
6. 回傳 SSE Response
```

### 3.2 Prompt 模組化

每個 `worker/src/prompts/*.js` 只做兩件事：

```js
export const MODEL = '@cf/meta/llama-3.x-...';
export function assembleXxxPrompt(...args) { return `...`; }
```

好處：handler 不含 prompt 字串，模型切換只改一個檔案。

### 3.3 Endpoints 一覽

| Endpoint | Model | max_tokens | Prompt 字數限制 | Rate Limit |
|----------|-------|-----------|----------------|------------|
| `POST /query` | llama-3.2-3b-instruct | 1024 | ≤400 字 | 20次/IP/分鐘 |
| `POST /analyze-jd` | llama-3.1-8b-instruct | 2048 | ≤600 字 | 5次/IP/小時 |
| `POST /match-jd` | llama-3.3-70b-fp8-fast | 2048 | ≤700 字 | 10次/IP/小時 |
| `POST /apply-resume` | llama-3.3-70b-fp8-fast | 4096 | ≤700 字 | 10次/IP/小時 |
| `POST /apply-cover` | llama-3.3-70b-fp8-fast | 2048 | ≤350 字 | 10次/IP/小時 |
| `POST /health-check` | 8B（評分）+ 70B（建議）| 4096 | 建議 ≤500 字 | 5次/IP/小時 |

---

## 4. AI Pipeline 設計

### 4.1 Chat RAG（/query）

最典型的 RAG 流程，加上 Cache 優化：

```
POST /query { message, history }
     │
     ▼
Rate Limit（20/min）
     │
     ▼
sha256(query) → Cache API 查詢
     │
  ┌──┴──┐
HIT    MISS
 │       │
 │       ▼
 │   bge-m3 embed(query)  ← 1024 維向量
 │       │
 │       ▼
 │   Vectorize topK=5     ← 語意最近的 5 個 chunk
 │       │
 │       ▼
 │   組裝 prompt（context + history + query）
 │       │
 │       ▼
 │   llama-3.2-3b stream
 │       │
 │       ▼
 │   Tee stream
 │   ├── → SSE 回傳前端
 │   └── → Cache.put（waitUntil 背景執行）
 │
 └── 直接回傳快取 SSE
```

**教學重點**：`waitUntil()` 讓快取寫入在 Response 送出後繼續執行，不阻塞首次回應。

### 4.2 JD Analyzer（/analyze-jd）

與 Chat RAG 相似，差異在於：
- topK=8（需要更多 context 做完整分析）
- 使用 8B 模型（結構化輸出，4 個固定段落）
- 無快取（每次 JD 不同）

### 4.3 Job Wizard（/match-jd → /apply-resume + /apply-cover）

**Step1 /match-jd**：RAG pipeline，與 JD Analyzer 相同架構，但 prompt 從求職者視角撰寫。

**Step2 拆分設計**（重要）：

原本 `/apply-job` 用一次 LLM 呼叫同時生成履歷和求職信，以 HTML 註解 marker 分割。問題：token budget 共享，長文件容易截斷。

現在拆成兩個獨立 endpoint，並在 prompt 層加字數限制：

```
前端 useJobApply
  │
  ├── fetch /apply-resume  ──► llama-3.3-70b, max_tokens=4096, prompt ≤700 字 → resumeText
  └── fetch /apply-cover   ──► llama-3.3-70b, max_tokens=2048, prompt ≤350 字 → coverText
      （Promise.all 並行）
```

**雙層截斷保護**：prompt 字數限制讓 LLM 主動收斂輸出，max_tokens 作為最後的硬截斷保險，正常情況下不會觸發。

**Step2 資料來源**：不用 RAG，直接 fetch GitHub Pages 靜態 JSON：

```js
const BASE = 'https://a920604a.github.io/self-reusme-website';
const [profile, works, projects, skills] = await Promise.all([
  fetch(`${BASE}/data/profile.json`).then(r => r.json()),
  fetch(`${BASE}/data/works.json`).then(r => r.json()),
  fetch(`${BASE}/data/projects.json`).then(r => r.json()),
  fetch(`${BASE}/data/skills.json`).then(r => r.json()),
]);
```

原因：生成完整履歷需要**所有**工作和專案，RAG topK 取樣可能漏掉重要經歷。

### 4.4 Resume Health Check（/health-check）

最複雜的 pipeline，雙階段設計：

```
POST /health-check { mode: "base" | "jd", jd? }
     │
     ▼
fetch GitHub Pages JSON（完整 candidateData）
     │
     ▼
[非串流] scoringCall(basePrompt, llama-3.1-8b)
     │  → 回傳 JSON { impact, technical_depth, readability, ownership, career_progression }
     │
[jd 模式] scoringCall(jdPrompt, llama-3.1-8b)  ← 並行
     │  → 回傳 JSON { ats_compatibility, job_relevance, differentiation,
     │                missing_keywords, hiring_recommendation }
     │
     ▼
合併 scores
     │
     ▼
SSE: data: {"type":"scores","data":{...}}   ← 前端立即渲染分數面板
     │
     ▼
[串流] rewriteCall(scores + candidateData, llama-3.3-70b)
     │
     ▼
SSE: data: {"response":"token"} × N
SSE: data: [DONE]
```

**為什麼評分用非串流？**  
評分 prompt 要求輸出純 JSON，串流模式下 JSON 可能在 token 邊界截斷導致 parse 失敗。非串流確保拿到完整字串後再 parse，並加 retry（最多 2 次）。

**Overall Score 計算**：前端計算（各維度平均 × 10），不依賴後端，避免 LLM 算術不穩定。

---

## 5. 串流協定（SSE）

### 5.1 SSE 格式

Cloudflare Workers AI 的串流輸出直接符合 SSE 格式：

```
data: {"response":"Hello"}\n\n
data: {"response":" world"}\n\n
data: [DONE]\n\n
```

前端解析：

```js
const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split('\n');
  buffer = lines.pop(); // 保留不完整的最後一行
  for (const line of lines) {
    if (!line.startsWith('data: ')) continue;
    const data = line.slice(6).trim();
    if (data === '[DONE]') continue;
    const { response } = JSON.parse(data);
    // 累加 token 更新 UI
  }
}
```

**教學重點**：`buffer = lines.pop()` 處理 chunk 邊界切割問題——TCP 封包可能在 `\n\n` 中間切斷，需要跨 chunk 拼接。

### 5.2 為什麼用 SSE 而非 WebSocket？

| | SSE | WebSocket |
|---|---|---|
| 方向 | 伺服器 → 客戶端（單向） | 雙向 |
| 建立方式 | 標準 `fetch()` | 需要 `new WebSocket()` |
| Cloudflare Workers 支援 | 原生支援 | 需要額外設定 |
| LLM token 串流 | ✅ 完全符合需求 | 過度設計 |

LLM token 串流只需單向推送，SSE 是最簡單的選擇。

### 5.3 Health Check 混合 SSE

Health Check 在同一個 SSE stream 裡混合兩種事件：

```
data: {"type":"scores","data":{...}}   ← 結構化事件
data: {"response":"建議內容..."}        ← 串流 token
data: [DONE]
```

前端以 `parsed.type === 'scores'` 區分：

```js
if (parsed.type === 'scores') {
  setScores(parsed.data);
  setIsLoadingScores(false);
} else {
  const token = parsed.response ?? '';
  setSuggestions(prev => prev + token);
}
```

---

## 6. 資料層與 Vectorize

### 6.1 資料來源

所有個人資料存放在 `public/data/`（靜態 JSON，隨前端部署到 GitHub Pages）：

```
profile.json   → 個人簡介、聯絡方式
works.json     → 工作經歷
projects.json  → 專案列表
skills.json    → 技能、工具、框架
education.json → 學歷
```

### 6.2 Ingest Pipeline

```
node worker/scripts/ingest.js
     │
     ▼
讀取 public/data/*.json
     │
     ▼
產生 text chunk（每筆 work / project / skill 各一個 chunk）
     │
     ▼
POST https://api.cloudflare.com/client/v4/ai/run/@cf/baai/bge-m3
     │  → 1024 維向量
     ▼
Vectorize upsert（id, values, metadata）
     │
     ▼
portfolio-index（cosine similarity）
```

### 6.3 RAG 查詢流程

```
query string
  → bge-m3 embed（1024d）
  → Vectorize.query(vector, { topK: 5 or 8 })
  → 取回最相關 chunk 的 metadata.text
  → 組入 prompt 作為 context
```

### 6.4 何時用 RAG，何時直接 fetch JSON？

| 場景 | 策略 | 原因 |
|------|------|------|
| Chat（/query） | RAG topK=5 | 只需回答特定問題，不需全部資料 |
| JD Analyzer | RAG topK=8 | 找最相關的 chunk 做分析 |
| Job Wizard Step1 | RAG topK=8 | 同上 |
| Job Wizard Step2 | 直接 fetch JSON | 生成完整履歷需要所有資料 |
| Health Check | 直接 fetch JSON | 評分需要全貌，取樣會影響公平性 |

---

## 7. 存取控制

### 7.1 公開功能

- 主頁、專案、工作經歷
- FloatingChatWidget
- JD Analyzer（`/jd-analyzer`）

### 7.2 PIN 保護（Workspace）

```
/workspace → PinGate 元件
               │
               ├── 讀取 sessionStorage['workspace_unlocked']
               │   → 已解鎖：直接渲染 WorkspacePage
               │
               └── 未解鎖：顯示 PIN 輸入框
                   → 比對 process.env.REACT_APP_WORKSPACE_PIN
                   → 正確：sessionStorage.setItem('workspace_unlocked', '1')
```

**設計考量**：
- PIN 在 build 時注入（`REACT_APP_WORKSPACE_PIN` 環境變數），不需後端 session
- `sessionStorage` 確保關閉分頁後需重新輸入
- 適合個人私用工具，不引入額外基礎設施

**注意**：PIN 值會打包進 JS bundle，適合低安全需求的個人工具。若需更高安全性，應改為後端驗證。

---

## 8. Rate Limiting

### 8.1 實作

```js
// worker/src/rateLimiter.js
export const RATE_LIMITS = {
  query:       { limit: 20, windowSecs: 60,   prefix: 'rl:' },
  analyzeJD:   { limit: 5,  windowSecs: 3600, prefix: 'rl-jd:' },
  matchJD:     { limit: 10, windowSecs: 3600, prefix: 'rl-private:match:' },
  applyJob:    { limit: 10, windowSecs: 3600, prefix: 'rl-private:apply:' },
  healthCheck: { limit: 5,  windowSecs: 3600, prefix: 'rl-private:health:' },
};

export async function checkRateLimit(kv, ip, { limit, windowSecs, prefix }) {
  const windowId = Math.floor(Date.now() / (windowSecs * 1000));
  const key = `${prefix}${ip}:${windowId}`;
  const count = parseInt((await kv.get(key)) || '0');
  if (count >= limit) return { limited: true, retryAfter: windowSecs };
  await kv.put(key, String(count + 1), { expirationTtl: windowSecs * 2 });
  return { limited: false };
}
```

### 8.2 設計重點

**Sliding window 近似**：以 `Math.floor(Date.now() / windowSecs / 1000)` 作為 window ID，每個時間窗口一個 KV key，自動過期（`expirationTtl = windowSecs * 2`）。

**集中管理**：所有限流設定在 `RATE_LIMITS` 物件，調整限制不需修改各 handler。

**以 IP 為單位**：取 `CF-Connecting-IP` header（Cloudflare 自動注入真實 IP）。

---

## 9. 部署流程

### 9.1 前端（GitHub Pages）

```yaml
# .github/workflows/deploy.yml
- npm run build          # 注入 REACT_APP_WORKER_URL, REACT_APP_WORKSPACE_PIN
- npm run deploy         # gh-pages 推送 build/ 到 gh-pages branch
```

### 9.2 Worker（Cloudflare）

```bash
cd worker
npx wrangler deploy
# → https://portfolio-rag.<account>.workers.dev
```

### 9.3 Vectorize 資料同步

```bash
cd worker
node scripts/ingest.js
```

修改 `public/data/*.json` 後需手動執行，重新向量化並 upsert。

### 9.4 環境變數

| 變數 | 位置 | 用途 |
|------|------|------|
| `REACT_APP_WORKER_URL` | GitHub Secret + `.env` | Worker URL，build 時注入 |
| `REACT_APP_WORKSPACE_PIN` | GitHub Secret + `.env` | Workspace PIN，build 時注入 |
| `CLOUDFLARE_API_TOKEN` | 本機 shell | ingest.js 向量化 |
| `CLOUDFLARE_ACCOUNT_ID` | 本機 shell | ingest.js Cloudflare API |

---

## 10. 關鍵設計決策 Q&A

**Q: 為什麼前端部署在 GitHub Pages 而不是 Cloudflare Pages？**  
A: GitHub Pages 與 GitHub Actions CI/CD 整合最簡單，一個 `npm run deploy` 完成。Cloudflare Pages 也可行，但需要額外設定。

**Q: 為什麼 Worker 不直接讀 KV 存放個人資料，而是 fetch GitHub Pages JSON？**  
A: 個人資料已經是靜態 JSON 部署在 GitHub Pages，直接 fetch 不需要維護兩份資料。KV 只用於 rate limit 計數這種需要快速讀寫的場景。

**Q: 為什麼 /apply-resume 和 /apply-cover 要拆成兩個 endpoint？**  
A: 原本單一 endpoint 用 marker 分割兩份文件，token budget 共享（8192 token 要同時生成履歷和求職信），長文件容易截斷。拆開後各自有完整 token budget，前端 `Promise.all` 並行發出，速度不變。

**Q: 為什麼 Health Check 評分用非串流，建議用串流？**  
A: 評分需要輸出嚴格 JSON 格式，串流模式下 JSON 可能在 token 邊界截斷導致 `JSON.parse` 失敗。建議是自由文字，串流體驗更好。兩種需求不同，分開處理。

**Q: Cache API 快取 /query 回應，如何處理個人化問題？**  
A: 快取 key 是 `sha256(query)`，相同問題才命中快取。Chat history 不計入 key（避免 key 爆炸），適合「介紹你的專案」這類重複性高的問題。

**Q: 多模型分層策略的成本考量？**  
A: Cloudflare Workers AI 按 token 計費。3B 模型成本最低用於高頻 Chat，8B 用於結構化分析，70B 只用於需要高品質長文件生成的場景。分層選用在品質和成本間取得平衡。

**Q: 為什麼不用 WebSocket 做串流？**  
A: LLM token 串流只需伺服器→客戶端單向推送，SSE 透過標準 `fetch()` + `ReadableStream` 即可，不需要 WebSocket 的雙向連線開銷。Cloudflare Workers 對 SSE 的支援也更直接。

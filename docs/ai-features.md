# AI 功能說明與比較

本文件說明三個 AI 功能的設計目的、使用流程與技術差異。系統架構詳見 [architecture.md](./architecture.md)。

---

## RAG 機制說明

**RAG（Retrieval-Augmented Generation）** 是本專案 AI pipeline 的核心技術之一。流程如下：

```
使用者輸入（JD 或問題）
        │
        ▼
  bge-m3 向量化（1024 維）
        │
        ▼
  Vectorize 語意搜尋（cosine similarity）
        │  topK=5（Chat）或 topK=8（JD 分析）
        ▼
  取回最相關的 portfolio chunk（工作經歷、專案、技能）
        │
        ▼
  組裝 prompt：[system instruction] + [retrieved context] + [user input]
        │
        ▼
  LLM 生成回應（串流輸出）
```

**為什麼需要 RAG？**  
LLM 本身不知道候選人的個人資料。RAG 讓 Worker 在每次請求時動態取回最相關的資料片段注入 prompt，而不是把所有資料塞進 prompt（避免 context 過長、成本過高）。

**何時不用 RAG？**  
需要完整資料的場景（生成完整履歷、履歷健檢評分）改用直接 fetch GitHub Pages 靜態 JSON，確保不遺漏任何工作或專案。詳見各功能的「關鍵設計」說明。

---

## 功能一覽

| | **JD Analyzer** | **Job Wizard** | **Resume Health Check** |
|---|---|---|---|
| 路由 | `/jd-analyzer` | `/workspace`（Tab 1） | `/workspace`（Tab 2） |
| 存取 | 公開 | PIN 驗證 | PIN 驗證 |
| 目標用戶 | 招募方 / HR | 求職者（私人） | 求職者（私人） |
| 輸入 | JD 文字（最多 5,000 字） | JD 文字（最多 5,000 字） | 無 JD（快速）或 JD（比對） |
| 資料來源 | Vectorize RAG（topK=8） | Step1 RAG + Step2 直接 fetch JSON | 直接 fetch GitHub Pages JSON |
| Worker 端點 | `POST /analyze-jd` | `POST /match-jd` → `POST /apply-resume` + `POST /apply-cover` | `POST /health-check` |
| LLM 模型 | llama-3.1-8b | llama-3.3-70b-fp8（兩步） | llama-3.1-8b（評分）+ llama-3.3-70b（建議）|
| Rate Limit | 5 次/hr | match 10 次/hr，apply 10 次/hr | 5 次/hr |
| 輸出 | 串流 Markdown（4 段） | 串流 Resume + Cover Letter，可打包 ZIP | JSON 評分面板 + 串流改寫建議 |
| 前端 Hook | `useJDAnalysis` | `useJDMatch` + `useJobApply` | `useHealthCheck` |

---

## JD Analyzer

**視角**：招募方（HR / 用人主管）

**入口**：`/ai-lab` → Open JD Analyzer → `/jd-analyzer`

### 流程

1. 使用者貼入 JD（最多 5,000 字）
2. Worker 截取前 2,000 字用 `bge-m3` 向量化
3. Vectorize 取回 topK=8 最相關的 portfolio chunk 作為 RAG context
4. `llama-3.1-8b-instruct` 串流輸出固定格式 Markdown：
   - `## Key Requirements Match`
   - `## Relevant Projects`
   - `## Candidate Strengths for This Role`
   - `## Potential Gaps`
5. 串流結束後，若分析內容提及已知 project id，頁面自動 scroll 並高亮對應 project card（`rag-glow` 動畫）

### 關鍵設計

- 使用 RAG 而非直接 fetch JSON，確保只取最相關的 chunk，避免 prompt 過長
- 分析語言跟隨 JD 語言（prompt 結尾加 `Reply in the same language`）
- 公開存取，無需登入，供外部招募方直接使用

---

## Job Wizard

**視角**：求職者（私人工具）

**入口**：`/workspace`（需 PIN）→ Job Wizard tab

### 三步驟流程

#### Step 1 — JD Match（`POST /match-jd`）

1. 貼入 JD
2. Worker：bge-m3 向量化 JD → Vectorize topK=8 → RAG context
3. `llama-3.3-70b-instruct-fp8-fast` 串流輸出從求職者角度的分析：
   - `## 契合度總覽`（含分數，如 75/100）
   - `## 強項`
   - `## 落差`
   - `## 面試準備建議`

#### Step 2 — Job Apply（`POST /apply-resume` + `POST /apply-cover`）

1. 接收 Step 1 的 JD 文字 + JD Match 分析結果
2. Worker 直接 fetch GitHub Pages 靜態 JSON（profile / works / projects / skills）組成完整 candidateData
3. 前端以 `Promise.all` 並行發出兩個請求：
   - `POST /apply-resume` → `llama-3.3-70b`，max_tokens=4096，prompt 限制 ≤700 字 → 客製化履歷（含 Professional Summary / Skills / Work Experience / Projects / Education）
   - `POST /apply-cover` → `llama-3.3-70b`，max_tokens=2048，prompt 限制 ≤350 字 → 求職信（4 段結構）
4. 兩個 stream 各自即時更新 Resume 和 Cover Letter 兩個 tab

#### Step 3 — Release

- 列出三份文件：`jd-match.md`、`resume.md`、`cover-letter.md`
- 可個別下載 `.md` 或一鍵打包 ZIP（JSZip）

### 關鍵設計

- Step2 不用 RAG 而是直接 fetch 完整 JSON：避免向量搜尋取樣不完整，確保履歷涵蓋所有工作與專案
- 拆成兩個獨立 endpoint（`/apply-resume` + `/apply-cover`）並行呼叫：各自有完整 token budget，避免單次呼叫 token 共享導致截斷；prompt 層加字數限制（履歷 ≤700 字、求職信 ≤350 字）確保輸出完整
- 使用 70B 模型：文件生成品質要求高，值得用大模型

---

## Resume Health Check

**視角**：求職者（私人工具）

**入口**：`/workspace`（需 PIN）→ Resume Health Check tab

### 兩種模式

| 模式 | 觸發條件 | 評分維度 | 額外輸出 |
|------|---------|---------|---------|
| `base`（快速健檢） | 無需 JD | 5 維度 | — |
| `jd`（JD 比對） | 需貼 JD | 5 + 3 維度 | 缺少關鍵字、錄取建議 |

**5 個基礎維度**（`resume-eval-base.js`，`llama-3.1-8b`）：

| 維度 | 說明 |
|------|------|
| `impact` | 量化成果 |
| `technical_depth` | 技術深度 |
| `readability` | 履歷易讀性 |
| `ownership` | 主導力 |
| `career_progression` | 職涯成長軌跡 |

**3 個 JD 比對維度**（`resume-eval-jd.js`，`llama-3.1-8b`）：

| 維度 | 說明 |
|------|------|
| `ats_compatibility` | ATS 關鍵字相容性 |
| `job_relevance` | 職缺契合度 |
| `differentiation` | 差異化亮點 |

另外輸出 `missing_keywords`（缺少的 JD 關鍵字）與 `hiring_recommendation`（Strong Yes / Yes / Maybe / No）。

### 後端協定（雙階段 SSE）

```
POST /health-check
  │
  ├── [同步] scoringCall(basePrompt)        ← llama-3.1-8b，非串流，回傳 JSON
  ├── [同步] scoringCall(jdPrompt)          ← 僅 jd 模式，同樣非串流
  │
  │   scores 合併後：
  │
  ├── SSE: data: {"type":"scores","data":{...}}   ← 前端立即渲染分數面板
  │
  └── [串流] rewriteCall(scores, candidateData)   ← llama-3.3-70b，token by token
          SSE: data: {"response":"token"}  × N
          SSE: data: [DONE]
```

前端 `useHealthCheck` 以 `parsed.type === 'scores'` 判斷事件類型，收到 scores 後切換 `isLoadingScores → false`、`isStreamingSuggestions → true`，讓評分面板與改寫建議可以逐步呈現。

### 關鍵設計

- **兩次非串流評分 call** — JSON 格式要求嚴格（prompt 指定輸出純 JSON），串流模式容易截斷導致 parse 失敗，故評分改用非串流並加 retry（最多 2 次）
- **大模型只用於建議** — 評分用 8B（快速 + 結構化），建議用 70B（品質優先），分工明確
- **Overall Score** — 前端計算（各維度 score 平均 × 10），不依賴後端

---

## 三功能設計比較

### 資料取得策略

```
JD Analyzer    → Vectorize RAG（bge-m3 embed → topK=8）
                  適合：「哪些 chunk 最相關？」
                  限制：topK 可能漏掉部分工作經歷

Job Wizard     → Step1 RAG + Step2 直接 fetch JSON
                  適合 Step2：生成完整履歷需要全部資料，不能靠取樣

Health Check   → 直接 fetch JSON（profile + works + projects + skills）
                  適合：評分需要全貌，RAG 取樣可能影響分數公平性
```

### LLM 選用策略

```
llama-3.2-3b   → /query（Chat）— 短對話，省成本
llama-3.1-8b   → /analyze-jd、健檢評分 — 結構化 JSON，中等複雜度
llama-3.3-70b  → /match-jd、/apply-resume、/apply-cover、健檢改寫 — 長文件生成，品質優先
```

### 存取控制

- **公開**：JD Analyzer — 對外展示用，招募方無需帳號
- **PIN 保護**：Job Wizard + Health Check — 個人私用工具，PIN 存 `sessionStorage`，不引入後端 session 基礎設施

### 串流協定差異

| 功能 | 協定 | 說明 |
|------|------|------|
| JD Analyzer | 純串流 SSE | token 逐一累加至 result |
| Job Wizard Step1 | 純串流 SSE | token 累加至 matchResult |
| Job Wizard Step2 | 兩個並行純串流 SSE | `/apply-resume` 和 `/apply-cover` 各自獨立 stream |
| Health Check | 混合 SSE（scores 事件 + 串流 token） | 先 JSON 事件更新分數面板，再串流改寫建議 |

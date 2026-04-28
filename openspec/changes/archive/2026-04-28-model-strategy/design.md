## 背景

Cloudflare Worker 服務多個 AI endpoint。目前所有呼叫 LLM 的 endpoint 都硬編碼 `@cf/meta/llama-3-8b-instruct`。這個模型是舊版 8B 指令模型，無 function calling 能力、多語言支援有限、不適合長文生成任務。

`prompt-management` change 已將 prompt 邏輯抽離至 `worker/src/prompts/*.js` 模組。本 change 在此基礎上，為各 endpoint 指定最適合其任務特性的模型。

**現狀：**
- `/query` — RAG chat，使用 `llama-3-8b-instruct`（勉強夠用但可更快）
- `/analyze-jd` — JD 分析，使用 `llama-3-8b-instruct`（JSON 可靠性差、中文支援弱）
- `/match-jd`、`/apply-job`、`/health-check` — 規劃中，模型未定

## Goals / Non-Goals

**Goals：**
- 為所有 Worker endpoint 定義清楚且有文件的模型分配
- 更新現有 `handleQuery` 與 `handleJDAnalysis` 使用各自指定的模型
- 在各 prompt 模組中標注 `MODEL` 常數，讓模型分配與 prompt 共同管理
- 讓 `/match-jd`、`/apply-job`、`/health-check` 的實作者有明確的模型決策可參照

**Non-Goals：**
- 實作 `/match-jd`、`/apply-job`、`/health-check` endpoint（由其他 change 負責）
- 更動 embedding 模型（bge-m3）或 Vectorize 設定
- 任何前端改動
- 執行期間的模型 A/B 測試

## 決策

### 決策 1：per-endpoint 模型，非 per-worker 模型

每個 `handle*` 函式獨立呼叫 `env.AI.run(MODEL, ...)`。同一個 Worker 可在不同請求中呼叫不同模型——Cloudflare Workers AI 按推理次數計費，非按 Worker 數量。

**考慮過的替代方案：**
- 所有 endpoint 用同一個模型：簡單但取最小公分母——夠快但品質不足，或夠好但太慢。
- 透過 KV 動態設定模型：增加運維複雜度，目前階段無收益。

### 決策 2：`/query` 使用 `llama-3.2-3b-instruct`

公開 RAG chat 重視延遲而非深度。3B 是 Cloudflare 上最快的 instruct 模型。RAG context（top-5 文件）補償了較少的參數量——事實依據比推理深度更重要。

**考慮過的替代方案：**
- 保留 `llama-3-8b`：略勝一籌但明顯較慢，對 chat widget 不值得。
- `llama-3.3-70b-fp8-fast`：對公開 Q&A widget 過度且延遲高。

### 決策 3：`/analyze-jd` 與 `/health-check` JSON 評分使用 `glm-4.7-flash`

GLM-4.7-flash 針對結構化輸出與 function calling 優化，且有強大的中英文雙語能力。`/analyze-jd` 必須輸出固定 Markdown 段落結構；`/health-check` 評分需要可機器解析的 JSON。兩者都受益於可靠輸出格式的模型。

**考慮過的替代方案：**
- `llama-3-8b`：JSON 輸出不穩定、無 function calling。
- `llama-3.3-70b-fp8-fast`：可靠但速度慢於必要，對結構化輸出任務小模型同樣可勝任。

### 決策 4：`/match-jd`、`/apply-job`、`/health-check` 建議串流使用 `llama-3.3-70b-instruct-fp8-fast`

這些任務需要在長 context（完整履歷 + JD）中進行深度推理、高品質長文生成（Cover Letter、落差分析）或細膩的串流建議。70B FP8 量化模型在接近完整 70B 品質的同時，顯著降低了延遲。

**考慮過的替代方案：**
- `glm-4.7-flash`：雙語支援好但英文長文品質與深度推理鏈較弱。

### 決策 5：MODEL 常數與 prompt 模組共同放置

每個 `worker/src/prompts/<name>.js` 旁邊 export 一個 `MODEL` 字串常數。這讓「使用哪個模型」的決策緊鄰「說什麼」的邏輯，未來換模型只需修改單一檔案。

## 風險與取捨

- [風險] `llama-3.2-3b` 對複雜查詢品質較低 → 緩解：RAG grounding 補償；若使用者反映品質下降，一行程式碼換回 8B。
- [風險] `glm-4.7-flash` 在 Cloudflare 可能有用量限制或可用性問題 → 緩解：fallback 到 `llama-3-8b` 是每個 handler 一行的改動；該模型已 GA。
- [風險] `llama-3.3-70b-fp8-fast` 提高 `/match-jd` 和 `/apply-job` 的成本與延遲 → 緩解：這些是低頻、有 PIN 保護的私人 endpoint；品質值得代價，rate limit 防止濫用。
- [取捨] 使用三款不同模型增加了未來開發者的認知負擔 → 已在 prompt 模組與本設計文件中記錄。

## 遷移計畫

1. 在 `worker/src/prompts/query.js` 新增 `export const MODEL = '@cf/meta/llama-3.2-3b-instruct'`
2. 更新 `handleQuery` 引用 prompt 模組的 `MODEL`
3. 更新 `handleJDAnalysis` 使用 `'@cf/zhipu-ai/glm-4.7-flash'`
4. 在所有未來 endpoint 的 prompt 模組佔位檔加入對應 `MODEL` 常數
5. `npx wrangler deploy` 部署——不需要 Vectorize 或前端改動
6. 回滾：修改 `index.js` 中的模型字串；重新部署（< 1 分鐘）

## Open Questions

無——模型分配已根據任務特性與 2026-04 版 Cloudflare Workers AI 模型目錄確定。

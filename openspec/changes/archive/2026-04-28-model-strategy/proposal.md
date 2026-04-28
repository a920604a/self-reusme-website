## 為什麼

Worker 目前所有 AI 任務都使用同一個模型（`@cf/meta/llama-3-8b-instruct`），但此模型已過時且不支援 function calling。不同 endpoint 的需求差異很大——速度、多語言品質、可靠 JSON 輸出、長文生成——單一模型無法針對各任務最佳化。

## 變更內容

- 將 `/query` 的模型從 `llama-3-8b-instruct` 換為 `@cf/meta/llama-3.2-3b-instruct`（速度更快，適合公開 chat RAG）
- 將 `/analyze-jd` 的模型換為 `@cf/zhipu-ai/glm-4.7-flash`（可靠結構化輸出 + 多語言）
- 為 `/match-jd`、`/apply-job` 指定 `@cf/meta/llama-3.3-70b-instruct-fp8-fast`（深度推理 + 長文生成）
- 為 `/health-check` JSON 評分指定 `glm-4.7-flash`，串流建議指定 `llama-3.3-70b-instruct-fp8-fast`
- 每個 prompt 模組以 `MODEL` 常數標注其使用的模型

## Capabilities

### New Capabilities
- `model-assignment`：per-endpoint 模型分配策略——每個 Worker 路由使用與任務特性（速度、JSON 可靠性、推理深度、多語言支援）相符的模型

### Modified Capabilities
- `jd-analysis-endpoint`：`/analyze-jd` handler 改用 `@cf/zhipu-ai/glm-4.7-flash`，JSON 輸出可靠性需求正式寫入 spec

## 影響範圍

- `worker/src/index.js`：更新 `handleQuery` 與 `handleJDAnalysis` 的模型字串
- `worker/src/prompts/*.js`：各 prompt 檔案新增 `MODEL` 常數
- 未來 endpoint（`/match-jd`、`/apply-job`、`/health-check`）必須參照本 change 定義的模型
- 無前端改動；不更動 embedding 模型（bge-m3）或 Vectorize 設定
- 依賴 `prompt-management` change（prompt 已抽離為獨立模組）
- `private-workspace` 與 `resume-health-check` change 依賴本 change 的模型決策

## ADDED Requirements

### Requirement: Per-endpoint 模型分配
每個 Worker endpoint SHALL 使用與其任務特性相符的指定 AI 模型。模型分配 MUST 以 export 常數形式定義在對應的 prompt 模組（`worker/src/prompts/<name>.js`）中，並由 handler 在 `worker/src/index.js` 引用。

#### Scenario: /query 使用速度優化模型
- **WHEN** 請求由 `handleQuery` 處理
- **THEN** `env.AI.run` 以 `@cf/meta/llama-3.2-3b-instruct` 呼叫

#### Scenario: /analyze-jd 使用結構化輸出模型
- **WHEN** 請求由 `handleJDAnalysis` 處理
- **THEN** `env.AI.run` 以 `@cf/zhipu-ai/glm-4.7-flash` 呼叫

#### Scenario: /match-jd 使用深度推理模型
- **WHEN** 請求由 JD match handler 處理
- **THEN** `env.AI.run` 以 `@cf/meta/llama-3.3-70b-instruct-fp8-fast` 呼叫

#### Scenario: /apply-job 使用長文生成模型
- **WHEN** 請求由 job-apply handler 處理
- **THEN** `env.AI.run` 以 `@cf/meta/llama-3.3-70b-instruct-fp8-fast` 呼叫

#### Scenario: /health-check JSON 評分使用結構化輸出模型
- **WHEN** health-check handler 產生 JSON 評分物件
- **THEN** `env.AI.run` 以 `@cf/zhipu-ai/glm-4.7-flash` 呼叫

#### Scenario: /health-check 建議串流使用高品質模型
- **WHEN** health-check handler 串流建議文字
- **THEN** `env.AI.run` 以 `@cf/meta/llama-3.3-70b-instruct-fp8-fast` 呼叫

### Requirement: MODEL 常數與 prompt 共同放置
`worker/src/prompts/` 中的每個 prompt 模組 SHALL export 一個 `MODEL` 字串常數，標示 handler 呼叫該 prompt 時 MUST 使用的 AI 模型。

#### Scenario: Prompt 模組 export MODEL
- **WHEN** 開發者 import 某個 prompt 模組（例如 `query.js`）
- **THEN** 該模組 export 名為 `MODEL` 的常數，與 prompt template 並列

#### Scenario: Handler 引用 prompt 模組的 MODEL
- **WHEN** handler 函式呼叫 `env.AI.run`
- **THEN** 模型字串從 import 的 prompt 模組 `MODEL` export 取得，不得在 handler 內硬編碼

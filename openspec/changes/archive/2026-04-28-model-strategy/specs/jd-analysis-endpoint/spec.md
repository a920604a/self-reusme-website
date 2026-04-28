## MODIFIED Requirements

### Requirement: RAG 分析流程
端點 SHALL 執行：向量化 JD → Vectorize 搜尋（topK=8）→ 組裝 match prompt → 串流 `@cf/zhipu-ai/glm-4.7-flash` 回應。模型 SHALL 透過 prompt 模組的 `MODEL` 常數引用，不得在 handler 中硬編碼模型字串。

#### Scenario: 正常分析
- **WHEN** 請求通過驗證與 rate limit
- **THEN** 串流回應包含以下 Markdown 結構：`## Key Requirements Match`、`## Relevant Projects`、`## Candidate Strengths for This Role`、`## Potential Gaps`

#### Scenario: 語言跟隨 JD
- **WHEN** JD 為英文
- **THEN** 分析報告以英文輸出

#### Scenario: 使用 glm-4.7-flash 模型
- **WHEN** handler 呼叫 `env.AI.run`
- **THEN** 使用模型 `@cf/zhipu-ai/glm-4.7-flash`（非 `@cf/meta/llama-3-8b-instruct`）

#### Scenario: MODEL 從 prompt 模組引用
- **WHEN** `handleJDAnalysis` 呼叫 `env.AI.run`
- **THEN** 模型字串從 `jd-analyzer.js` 的 `MODEL` export 取得，不得在 handler 內硬編碼

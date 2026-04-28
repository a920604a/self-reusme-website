# health-check-endpoint Specification

## Purpose
TBD - created by archiving change resume-health-check. Update Purpose after archive.
## Requirements
### Requirement: Health Check endpoint dual mode
Worker SHALL 提供 `POST /health-check` endpoint，支援 `mode: "base"` 與 `mode: "jd"` 兩種模式。

#### Scenario: Mode base request
- **WHEN** POST `/health-check` 帶有 `{ mode: "base" }` body
- **THEN** 執行 2 次 LLM call（JSON scoring + streaming rewrite），回傳 SSE stream

#### Scenario: Mode jd request
- **WHEN** POST `/health-check` 帶有 `{ mode: "jd", jd: string }` body
- **THEN** 執行 3 次 LLM call（base JSON scoring + jd JSON scoring 並行 + streaming rewrite），回傳 SSE stream

#### Scenario: Mode jd missing jd field
- **WHEN** POST `/health-check` 帶有 `{ mode: "jd" }` 但缺少 `jd` 欄位
- **THEN** 回傳 400 JSON `{ error: "JD text required for jd mode" }`

#### Scenario: Rate limit enforced
- **WHEN** 同一 IP 在一小時內超過 5 次請求
- **THEN** 回傳 429 JSON `{ error: "Rate limit exceeded" }`

### Requirement: Base scoring dimensions
Mode base 的 JSON scoring SHALL 評估以下 5 個維度，每個維度分數 0–10。

#### Scenario: Base scores structure
- **WHEN** base JSON scoring LLM call 完成且解析成功
- **THEN** 回傳物件包含：`impact`、`technical_depth`、`readability`、`ownership`、`career_progression` 五個 key，各含 `score`（0–10）與 `reason`（字串）

### Requirement: JD scoring dimensions
Mode jd 額外的 JSON scoring SHALL 評估以下 5 個維度。

#### Scenario: JD scores structure
- **WHEN** jd JSON scoring LLM call 完成且解析成功
- **THEN** 回傳物件包含：`ats_compatibility`、`job_relevance`、`differentiation`、`hiring_recommendation`（字串）以及 `missing_keywords`（字串陣列）

### Requirement: Streaming rewrite suggestions
健檢 SHALL 在 JSON scoring 完成後，以 SSE stream 輸出具體的優化建議。

#### Scenario: Stream begins after scoring
- **WHEN** JSON scoring（base 或 jd）完成
- **THEN** SSE stream 開始傳送 Markdown 優化建議，包含針對低分維度的具體改寫示例

### Requirement: JSON parsing error handling
Worker SHALL 在 JSON parsing 失敗時重試一次。

#### Scenario: Retry on parse failure
- **WHEN** LLM 回傳的 JSON 無法解析
- **THEN** Worker 重試一次相同 call

#### Scenario: Double failure returns 500
- **WHEN** 重試後仍解析失敗
- **THEN** 回傳 500 JSON `{ error: "Scoring failed, please try again" }`


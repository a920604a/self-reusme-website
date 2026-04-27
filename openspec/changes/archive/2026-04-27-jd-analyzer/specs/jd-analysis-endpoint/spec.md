## ADDED Requirements

### Requirement: 接受 JD 輸入
Worker SHALL 提供 `POST /analyze-jd` 端點，接受 JSON body `{ jd: string }`。

#### Scenario: 正常請求
- **WHEN** 收到有效的 `{ jd: "..." }` POST 請求
- **THEN** 回傳 SSE stream，Content-Type 為 `text/event-stream`

#### Scenario: JD 超過上限
- **WHEN** `jd` 字串長度超過 5000 字元
- **THEN** 回傳 HTTP 400，body `{ error: "JD text too long (max 5000 chars)" }`

#### Scenario: 缺少 jd 欄位
- **WHEN** body 缺少 `jd` 或為空字串
- **THEN** 回傳 HTTP 400，body `{ error: "JD text is required" }`

### Requirement: 獨立 Rate Limit
`/analyze-jd` SHALL 採用獨立 rate limit：每 IP 每小時最多 5 次請求，不影響 `/query` 的計數。

#### Scenario: 未超過上限
- **WHEN** 同一 IP 在一小時內請求次數 ≤ 5
- **THEN** 正常處理請求

#### Scenario: 超過上限
- **WHEN** 同一 IP 在一小時內請求次數 > 5
- **THEN** 回傳 HTTP 429，body `{ error: "Rate limit exceeded. Try again later." }`

### Requirement: RAG 分析流程
端點 SHALL 執行：向量化 JD → Vectorize 搜尋（topK=8）→ 組裝 match prompt → 串流 llama-3-8b 回應。

#### Scenario: 正常分析
- **WHEN** 請求通過驗證與 rate limit
- **THEN** 串流回應包含以下 Markdown 結構：`## Key Requirements Match`、`## Relevant Projects`、`## Candidate Strengths for This Role`、`## Potential Gaps`

#### Scenario: 語言跟隨 JD
- **WHEN** JD 為英文
- **THEN** 分析報告以英文輸出

#### Scenario: 無快取
- **WHEN** 兩次送出相同 JD
- **THEN** 每次都重新執行分析（不使用快取）

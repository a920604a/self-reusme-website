# jd-match-endpoint Specification

## Purpose
TBD - created by archiving change private-workspace. Update Purpose after archive.
## Requirements
### Requirement: JD Match endpoint
Worker SHALL 提供 `POST /match-jd` endpoint，接受 JD 文字並回傳 streaming Markdown 分析。

#### Scenario: Successful match analysis
- **WHEN** POST `/match-jd` 帶有有效 `{ jd: string }` body
- **THEN** 回傳 SSE stream，內容為 Markdown 格式的契合分析，包含：強項、落差、面試建議

#### Scenario: Empty JD rejected
- **WHEN** POST `/match-jd` 帶有空字串或缺少 `jd` 欄位
- **THEN** 回傳 400 JSON `{ error: "JD text is required" }`

#### Scenario: JD too long rejected
- **WHEN** POST `/match-jd` 帶有超過 5000 字元的 `jd`
- **THEN** 回傳 400 JSON `{ error: "JD text too long (max 5000 chars)" }`

#### Scenario: Rate limit enforced
- **WHEN** 同一 IP 在一小時內超過 10 次請求
- **THEN** 回傳 429 JSON `{ error: "Rate limit exceeded" }`

### Requirement: JD Match prompt structure
`/match-jd` 的 prompt SHALL 以開發者視角分析，輸出包含以下四個段落。

#### Scenario: Output structure
- **WHEN** LLM 生成回應
- **THEN** Markdown 內容 SHALL 包含：`## 契合度總覽`、`## 強項`、`## 落差`、`## 面試準備建議`


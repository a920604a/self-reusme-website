## ADDED Requirements

### Requirement: Job Apply endpoint
Worker SHALL 提供 `POST /apply-job` endpoint，接受 JD 與 match summary，回傳 streaming 客製化履歷內容。

#### Scenario: Successful resume generation
- **WHEN** POST `/apply-job` 帶有有效 `{ jd: string, matchSummary: string }` body
- **THEN** 回傳 SSE stream，內容依序為：客製化履歷 Markdown（`<!-- RESUME_START -->` 標記）、Cover Letter Markdown（`<!-- COVER_START -->` 標記）

#### Scenario: Missing required fields
- **WHEN** POST `/apply-job` 缺少 `jd` 或 `matchSummary`
- **THEN** 回傳 400 JSON `{ error: "Missing required fields" }`

#### Scenario: Rate limit enforced
- **WHEN** 同一 IP 在一小時內超過 10 次請求
- **THEN** 回傳 429 JSON `{ error: "Rate limit exceeded" }`

#### Scenario: Language detection
- **WHEN** JD 主要語言為中文
- **THEN** 生成的履歷與 Cover Letter SHALL 以中文呈現

#### Scenario: Language detection English
- **WHEN** JD 主要語言為英文
- **THEN** 生成的履歷與 Cover Letter SHALL 以英文呈現

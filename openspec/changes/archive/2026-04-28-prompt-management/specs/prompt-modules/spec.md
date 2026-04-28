## ADDED Requirements

### Requirement: Prompt modules directory
Worker 的所有 prompt 組裝函式 SHALL 存放於 `worker/src/prompts/` 目錄，每個功能一個獨立 ES module 檔案。

#### Scenario: Existing prompts extracted
- **WHEN** 重構完成後
- **THEN** `worker/src/index.js` 不得包含任何 prompt 字串或 assemble 函式定義

#### Scenario: Each module exports an assemble function
- **WHEN** 任何 prompt 模組被 import
- **THEN** 該模組 SHALL export 至少一個以 `assemble` 開頭的函式

### Requirement: Existing prompts preserved
現有 chat RAG prompt（`assemblePrompt`）與 JD Analyzer prompt（`assembleJDPrompt`）搬移後 SHALL 保持內容完全一致，不得修改任何字元。

#### Scenario: Chat RAG prompt unchanged
- **WHEN** `assembleQueryPrompt(docs, query)` 被呼叫
- **THEN** 回傳內容與原 `assemblePrompt()` 完全相同

#### Scenario: JD Analyzer prompt unchanged
- **WHEN** `assembleJDAnalyzerPrompt(docs, jd)` 被呼叫
- **THEN** 回傳內容與原 `assembleJDPrompt()` 完全相同

### Requirement: Placeholder modules for future features
未實作的 prompt 模組 SHALL 建立佔位檔，export 函式並在被呼叫時 throw Error。

#### Scenario: Placeholder throws on call
- **WHEN** 佔位 prompt 函式被呼叫
- **THEN** 拋出 `Error('Not implemented')` 而非 return 空值

#### Scenario: Placeholder files exist
- **WHEN** prompt-management change 完成後
- **THEN** 以下檔案 SHALL 存在：`jd-match.js`、`resume-eval-base.js`、`resume-eval-jd.js`、`resume-eval-rewrite.js`、`job-apply.js`

## ADDED Requirements

### Requirement: Three-step Wizard UI
`/ai-lab/workspace` SHALL 實作三步驟線性 Wizard，步驟間資料自動傳遞。

#### Scenario: Step progression
- **WHEN** Step 1（JD Match）streaming 完成
- **THEN** Step 2（Job Apply）自動解鎖，顯示「繼續」按鈕

#### Scenario: Step 2 receives Step 1 data
- **WHEN** 使用者進入 Step 2
- **THEN** JD 文字與 Step 1 Markdown 結果自動帶入，無需重新輸入

#### Scenario: Step 3 download
- **WHEN** Step 2 完成，使用者進入 Step 3（Release）
- **THEN** 點擊「Download ZIP」觸發 client-side 打包，下載包含 `jd-match.md`、`resume.md`、`cover-letter.md` 的 .zip 檔案

### Requirement: Individual file download
使用者 SHALL 可在 Step 2 完成後下載獨立的 .md 檔案，不需等到 Step 3。

#### Scenario: Resume download
- **WHEN** Step 2 streaming 完成
- **THEN** 顯示「下載履歷 .md」與「下載 Cover Letter .md」兩個按鈕

### Requirement: Reset wizard
使用者 SHALL 可重置 Wizard 從 Step 1 重新開始。

#### Scenario: Reset clears all data
- **WHEN** 使用者點擊「重新開始」
- **THEN** 所有步驟資料清空，回到 Step 1 空白狀態

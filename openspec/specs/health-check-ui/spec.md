# health-check-ui Specification

## Purpose
TBD - created by archiving change resume-health-check. Update Purpose after archive.
## Requirements
### Requirement: Mode selection UI
健檢介面 SHALL 提供清楚的模式選擇，讓使用者選擇「快速健檢」或「JD 比對」。

#### Scenario: Mode A selected
- **WHEN** 使用者選擇「快速健檢（無 JD）」
- **THEN** 不顯示 JD 輸入框，直接可點擊「開始健檢」

#### Scenario: Mode B selected
- **WHEN** 使用者選擇「JD 比對（10 維度）」
- **THEN** 顯示 JD Textarea 輸入框，「開始健檢」按鈕在有 JD 內容後才啟用

### Requirement: Score panel display
健檢結果 SHALL 以視覺化進度條顯示各維度分數。

#### Scenario: Scores render
- **WHEN** JSON scoring 完成
- **THEN** 每個維度顯示名稱、進度條（0–100%）、分數（x/10）與 reason 文字

#### Scenario: Overall score displayed
- **WHEN** 所有維度分數取得後
- **THEN** 顯示加權總分（0–100）於頂部

#### Scenario: Low score highlighted
- **WHEN** 任一維度分數低於 6
- **THEN** 該維度進度條以警示色（紅/橘）顯示

### Requirement: Missing keywords display
Mode B 結果 SHALL 顯示缺少的關鍵字清單。

#### Scenario: Missing keywords listed
- **WHEN** JD 比對健檢完成
- **THEN** 在分數面板下方顯示 `missing_keywords` 清單（Badge 樣式）

### Requirement: Streaming suggestions
分數面板下方 SHALL 以 streaming 方式顯示 Markdown 優化建議。

#### Scenario: Suggestions stream after scores
- **WHEN** 分數面板渲染完成
- **THEN** 優化建議開始 streaming，使用者可看到即時生成效果


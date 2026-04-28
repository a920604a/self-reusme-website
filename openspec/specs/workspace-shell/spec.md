## ADDED Requirements

### Requirement: Workspace route shell
系統 SHALL 在 `/ai-lab/workspace` 提供工作區骨架頁面，PIN 驗證通過後可見。

#### Scenario: Shell renders after PIN
- **WHEN** PIN 驗證通過
- **THEN** `/ai-lab/workspace` 顯示工作區骨架，包含三個步驟的空 card（JD Match、Job Apply、Release）

#### Scenario: Shell is navigation-aware
- **WHEN** 使用者在 `/ai-lab/workspace`
- **THEN** Header 導航列的 AI Lab 項目顯示為 active 狀態

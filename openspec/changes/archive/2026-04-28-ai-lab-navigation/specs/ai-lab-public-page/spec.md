## ADDED Requirements

### Requirement: AI Lab public page
系統 SHALL 在 `/ai-lab` 路由提供公開頁面，展示 JD Analyzer 工具入口。

#### Scenario: Public access
- **WHEN** 任何訪客（未登入）訪問 `/ai-lab`
- **THEN** 頁面正常顯示，無需任何驗證

#### Scenario: Header nav item
- **WHEN** 訪客瀏覽任何頁面
- **THEN** Header 導航列 SHALL 包含「AI Lab」項目，點擊後導向 `/ai-lab`

#### Scenario: JD Analyzer accessible from AI Lab
- **WHEN** 訪客在 `/ai-lab` 頁面
- **THEN** 頁面 SHALL 提供 JD Analyzer 的明確入口（連結或嵌入）

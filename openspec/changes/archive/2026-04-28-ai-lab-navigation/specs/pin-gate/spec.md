## ADDED Requirements

### Requirement: PIN Gate protection
`/ai-lab/workspace` 路由 SHALL 受 PIN Gate 保護，未通過驗證者不得存取工作區內容。

#### Scenario: Unauthenticated access redirected
- **WHEN** 訪客直接訪問 `/ai-lab/workspace` 且 `sessionStorage.ws_unlocked` 不為 `"1"`
- **THEN** 顯示 PIN 輸入介面，不顯示工作區內容

#### Scenario: Correct PIN grants access
- **WHEN** 使用者輸入正確 PIN 並提交
- **THEN** `sessionStorage.ws_unlocked` 設為 `"1"`，工作區內容顯示

#### Scenario: Wrong PIN shows error
- **WHEN** 使用者輸入錯誤 PIN 並提交
- **THEN** 顯示錯誤提示，不進入工作區

#### Scenario: Session persistence
- **WHEN** 已通過 PIN 驗證的使用者重新整理頁面（同分頁）
- **THEN** 無需重新輸入 PIN，直接進入工作區

#### Scenario: Session cleared on tab close
- **WHEN** 使用者關閉分頁後重新開啟 `/ai-lab/workspace`
- **THEN** 需重新輸入 PIN

### Requirement: Developer Mode entry point
系統 SHALL 在 Footer 提供低調的「Developer Mode」文字連結作為私人工作區入口。

#### Scenario: Footer entry visible
- **WHEN** 訪客滾動到任何頁面底部
- **THEN** Footer 顯示小字「Developer Mode」連結

#### Scenario: Entry leads to PIN Gate
- **WHEN** 訪客點擊「Developer Mode」連結
- **THEN** 導向 `/ai-lab/workspace`，若未驗證則顯示 PIN Gate

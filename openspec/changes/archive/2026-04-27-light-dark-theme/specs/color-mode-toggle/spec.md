## ADDED Requirements

### Requirement: 系統偏好跟隨
網站 SHALL 預設跟隨使用者的作業系統 color scheme（`prefers-color-scheme`）。

#### Scenario: 系統為 dark mode
- **WHEN** 使用者系統設定為 dark mode 且未曾手動切換
- **THEN** 網站以 dark theme 顯示

#### Scenario: 系統為 light mode
- **WHEN** 使用者系統設定為 light mode 且未曾手動切換
- **THEN** 網站以 light theme 顯示

### Requirement: 手動切換
使用者 SHALL 可透過 Header 的切換按鈕在 light/dark 之間切換，覆蓋系統偏好。

#### Scenario: 切換主題
- **WHEN** 使用者點擊 Header 的主題切換按鈕
- **THEN** 網站立即切換至另一個主題，且按鈕圖示更新反映目前狀態

### Requirement: 切換狀態持久化
使用者手動切換的選擇 SHALL 持久化至 localStorage，重新整理或重開分頁後仍保留。

#### Scenario: 重新整理後保留選擇
- **WHEN** 使用者切換至 light mode 後重新整理頁面
- **THEN** 網站仍以 light mode 顯示

### Requirement: 無 hardcoded color
所有元件 SHALL 使用 semantic token 或 `useColorModeValue`，不得使用 hardcoded hex。

#### Scenario: Light mode 無視覺破損
- **WHEN** 網站切換至 light mode
- **THEN** 所有元件（含 SkillSection、FloatingChatWidget、App loading state）皆正確顯示 light 色彩，無深色殘留

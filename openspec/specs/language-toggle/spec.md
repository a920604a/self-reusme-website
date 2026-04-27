## ADDED Requirements

### Requirement: 語言切換按鈕
Header SHALL 提供 `ZH | EN` 切換按鈕，讓使用者在繁體中文與英文 UI 之間切換。

#### Scenario: 切換至英文
- **WHEN** 使用者點擊 EN
- **THEN** 所有靜態 UI 文字（nav、section 標題、按鈕、placeholder）立即切換為英文

#### Scenario: 切換至繁中
- **WHEN** 使用者點擊 ZH
- **THEN** 所有靜態 UI 文字立即切換為繁體中文

### Requirement: 語言選擇持久化
使用者的語言選擇 SHALL 持久化至 localStorage，重新整理或重開分頁後仍保留。

#### Scenario: 重新整理後保留語言
- **WHEN** 使用者切換至 EN 後重新整理頁面
- **THEN** 網站仍以英文 UI 顯示

#### Scenario: 預設語言
- **WHEN** 使用者首次造訪（無 localStorage 記錄）
- **THEN** 預設顯示繁體中文

### Requirement: JSON 內容不受影響
語言切換 SHALL 只影響靜態 UI 文字，`public/data/*.json` 的內容資料（專案名稱、工作經歷等）不隨語言切換。

#### Scenario: 切換語言後 JSON 內容不變
- **WHEN** 使用者切換至 EN
- **THEN** 專案標題、工作描述等 JSON 資料內容保持原樣不變

## Why

網站目前強制鎖死 dark mode（`useSystemColorMode: false`），且部分元件使用 hardcoded hex 而非 semantic token，導致即使解鎖 color mode 也會有視覺破損。現在 P1 目標是讓訪客可以跟隨系統偏好或手動切換主題。

## What Changes

- `src/theme.js`：移除 `useSystemColorMode: false`，改為跟隨系統（或允許手動切換）
- `src/App.js`：將 hardcoded hex（`#0b1326`、`#ff6b6b`、`#908fa0`、`#c0c1ff`）改為 semantic token
- `src/components/SkillSection.js`：將 `bg="#131b2e"` 改為 semantic token
- `src/components/FloatingChatWidget.js`：審查並替換 inline style 中的 hardcoded hex
- Header：新增 Light/Dark 切換按鈕（Chakra UI `useColorMode` hook）

## Capabilities

### New Capabilities
- `color-mode-toggle`: 使用者可切換 light/dark 主題，預設跟隨系統偏好；切換狀態由 Chakra UI 自動持久化至 localStorage

### Modified Capabilities
<!-- 無現有 spec 需要修改 -->

## Impact

- `src/theme.js`：config 設定變更
- `src/App.js`：loading state 的 hardcoded color 替換
- `src/components/SkillSection.js`：1 個 hardcoded bg
- `src/components/FloatingChatWidget.js`：inline style 審查
- `src/components/Header.js`：新增 toggle 按鈕
- 無 API 或 Worker 變動
- 無 breaking change

## 1. 解鎖 Color Mode

- [x] 1.1 `src/theme.js`：將 `useSystemColorMode: false` 改為 `true`，移除 `initialColorMode: "dark"`

## 2. 修復 Hardcoded Hex

- [x] 2.1 `src/App.js`：loading state 的 `bg="#0b1326"` 改為 `bg="bg.canvas"`
- [x] 2.2 `src/App.js`：error text `color="#ff6b6b"` 改為 Chakra `red.400`（或 `useColorModeValue`）
- [x] 2.3 `src/App.js`：secondary text `color="#908fa0"` 改為 `color="label.secondary"`
- [x] 2.4 `src/App.js`：spinner `color="#c0c1ff"` 改為 `color="accent"`
- [x] 2.5 `src/App.js`：empty state text `color="#908fa0"` 改為 `color="label.secondary"`
- [x] 2.6 `src/components/SkillSection.js`：`bg="#131b2e"` 改為 `bg="bg.primary"`
- [x] 2.7 `src/components/FloatingChatWidget.js`：審查所有 inline style，hardcoded hex 改為 semantic token 或 `useColorModeValue`

## 3. Header 切換按鈕

- [x] 3.1 `src/components/Header.js`：引入 `useColorMode`、`IconButton`、`SunIcon`、`MoonIcon`
- [x] 3.2 `src/components/Header.js`：在 nav 右側新增切換按鈕，根據目前 color mode 顯示對應圖示

## 4. 驗證

- [x] 4.1 `npm start` 本機啟動，手動切換 light/dark，目測所有頁面無深色殘留或破版
- [x] 4.2 模擬系統 light mode（瀏覽器 DevTools → Rendering → Emulate CSS prefers-color-scheme: light），確認預設為 light theme

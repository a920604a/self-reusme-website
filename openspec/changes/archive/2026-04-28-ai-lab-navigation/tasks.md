## 1. 新建元件與頁面

- [x] 1.1 建立 `src/components/PinGate.js`：含 PIN 輸入框、送出按鈕、錯誤訊息；讀取 `process.env.REACT_APP_WORKSPACE_PIN`；通過後寫入 `sessionStorage.ws_unlocked = "1"`
- [x] 1.2 建立 `src/pages/AILabPage.js`：公開頁面，展示 JD Analyzer 說明卡片與「前往 JD Analyzer」按鈕（連結至 `/jd-analyzer`）
- [x] 1.3 建立 `src/pages/WorkspacePage.js`：私人工作區骨架，PIN Gate 包裹，顯示三個空步驟 Card（JD Match / Job Apply / Release），標示「Coming Soon」

## 2. 更新路由

- [x] 2.1 `src/App.js`：新增 `<Route path="/ai-lab" element={<AILabPage />} />`
- [x] 2.2 `src/App.js`：新增 `<Route path="/ai-lab/workspace" element={<WorkspacePage />} />`

## 3. 更新 Header

- [x] 3.1 `src/components/Header.js`：`navItems` 陣列中移除 `jd-analyzer` 項目，新增 `{ label: t('nav.aiLab'), to: '/ai-lab', anchor: 'ai-lab' }` 項目

## 4. 更新 Footer

- [x] 4.1 `src/components/Footer.js`：在底部新增「Developer Mode」小字連結（`as={RouterLink} to="/ai-lab/workspace"`），`fontSize="xs"`、`color={textSecondary}`

## 5. 更新 i18n

- [x] 5.1 `src/i18n/en.js`：新增 `nav.aiLab: 'AI Lab'`、`aiLab.title: 'AI Lab'`、`aiLab.pinLabel: 'Enter PIN'`、`aiLab.pinError: 'Incorrect PIN'`、`aiLab.devMode: 'Developer Mode'`
- [x] 5.2 `src/i18n/zh.js`：補充對應中文翻譯

## 6. 驗證

- [x] 6.1 `npm start` 本機啟動，確認 Header 顯示「AI Lab」，點擊進入 `/ai-lab` 頁面
- [x] 6.2 點擊 Footer「Developer Mode」，確認跳轉至 `/ai-lab/workspace` 並顯示 PIN Gate
- [x] 6.3 輸入錯誤 PIN，確認顯示錯誤訊息
- [x] 6.4 輸入正確 PIN，確認進入 Workspace 骨架
- [ ] 6.5 重新整理（同分頁），確認不需重新輸入 PIN
- [x] 6.6 `npm run build && npm run deploy` 部署

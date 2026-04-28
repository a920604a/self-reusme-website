## Why

目前 JD Analyzer 直接暴露在主導航，缺乏「AI 工具區」的整體概念。同時，開發者本人需要私人求職工作流工具（JD Match、Job Apply、Resume Health Check），但這些工具不應對一般訪客可見，也不應增加導航的視覺噪音。

## What Changes

- Header 新增「AI Lab」導航項目，指向公開 `/ai-lab` 頁面
- `/ai-lab` 公開頁：展示 JD Analyzer，訴求雇主使用
- Footer 新增低調的「Developer Mode」文字連結
- 點擊「Developer Mode」後進入 PIN Gate（client-side 驗證）
- PIN 驗證通過後進入 `/ai-lab/workspace`（私人 Wizard 骨架，內容由後續 change 填入）
- `src/App.js` 新增路由：`/ai-lab`、`/ai-lab/workspace`
- i18n（`en.js`、`zh.js`）補充 `aiLab.*` 翻譯字串

## Capabilities

### New Capabilities
- `ai-lab-public-page`: 公開 AI Lab 頁面，展示 JD Analyzer 入口
- `pin-gate`: Client-side PIN 驗證元件，保護私人工作區路由
- `workspace-shell`: `/ai-lab/workspace` 路由骨架（PIN 通過後可見）

### Modified Capabilities
<!-- 無 spec 層級的行為變更 -->

## Impact

- `src/App.js`：新增兩條路由
- `src/components/Header.js`：新增 AI Lab nav item
- `src/components/Footer.js`：新增 Developer Mode 入口
- `src/components/PinGate.js`：新建元件
- `src/pages/AILabPage.js`：新建頁面元件
- `src/pages/WorkspacePage.js`：新建骨架元件
- `src/i18n/en.js`、`src/i18n/zh.js`：新增 `aiLab.*` key

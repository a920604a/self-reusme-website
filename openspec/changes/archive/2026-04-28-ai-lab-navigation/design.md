## Context

現有 Header 使用平鋪 nav items 陣列（`navItems`），Footer 目前無特殊互動元素。React Router 已配置，Chakra UI 的 `useDisclosure`、`useColorModeValue` 等 hook 已在 Header 使用。i18n 以 `LocaleContext` 提供 `t()` 函式。

## Goals / Non-Goals

**Goals:**
- 公開 AI Lab 頁（`/ai-lab`）可獨立部署並展示 JD Analyzer
- PIN Gate 保護 `/ai-lab/workspace`，阻止隨機訪客直接存取
- Footer 入口低調（小字），不干擾一般訪客瀏覽流程
- Workspace 骨架可上線，顯示「Coming Soon」或空白 Wizard 框架

**Non-Goals:**
- 不實作任何 AI 功能（由 private-workspace、resume-health-check change 負責）
- PIN 不需要後端 session，client-side 驗證即可
- 不實作忘記 PIN / 重設流程

## Decisions

**決策 1：PIN 儲存方式**
- 選擇：PIN 以環境變數 `REACT_APP_WORKSPACE_PIN` 注入，build time 打包進 bundle
- 替代方案：hardcode 在元件內
- 理由：環境變數讓 CI/CD 可以不同環境使用不同 PIN，且不出現在 git history

**決策 2：PIN 驗證狀態儲存**
- 選擇：通過後寫入 `sessionStorage`（key: `ws_unlocked`），關閉分頁即清除
- 替代方案：`localStorage`（永久保留）
- 理由：sessionStorage 在每次新分頁都需重新輸入，更安全；localStorage 在公用電腦有風險

**決策 3：AI Lab nav item 位置**
- 選擇：插入 navItems 陣列最後一項（JD Analyzer 之後），取代原本的 "JD Analyzer" 單項
- 理由：JD Analyzer 成為 AI Lab 的一部分，從主導航移除獨立項目，改由 AI Lab 頁統一呈現

**決策 4：Developer Mode 入口**
- 選擇：Footer 最底部小字連結，`fontSize="xs"`、`color={textSecondary}`，不加圖示
- 理由：低調但可找到；不放在 Header 避免雇主注意到

## Risks / Trade-offs

- [Risk] `REACT_APP_WORKSPACE_PIN` 未設定時 app 無法進入 Workspace → Mitigation：PinGate 元件有 fallback 預設 PIN（開發用），production build 若未設定則顯示提示
- [Risk] Bundle 包含 PIN 值，理論上可被反編譯 → 可接受：這不是保護機密資料，只是 UX 隔離

## Migration Plan

1. 新增元件與頁面骨架
2. 更新路由（App.js）
3. 更新 Header（加 AI Lab item，移除獨立 JD Analyzer item）
4. 更新 Footer（加 Developer Mode 連結）
5. 更新 i18n
6. `npm start` 本機驗證全部路由
7. `npm run build && npm run deploy` 部署

## Open Questions

- Workspace 骨架的預設內容：顯示「工具建置中」還是空 Wizard 框架？→ 建議顯示三個步驟的空 card，讓結構可見

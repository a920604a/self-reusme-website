## Why

求職時除了「特定職缺的 fit 分析」，還需要「履歷本身品質的客觀評估」。目前沒有工具能給出量化分數並指出具體改進點。Resume Health Check 提供兩種模式：快速健檢（純履歷品質，無需 JD）與 JD 比對健檢（完整 10 維度，含職缺契合度），讓開發者在投遞前有明確的數字指標。

## What Changes

- Worker 新增 `POST /health-check` endpoint，支援 `mode: "base" | "jd"`
- `worker/src/prompts/resume-eval-base.js`：5 維度 JSON scoring prompt
- `worker/src/prompts/resume-eval-jd.js`：JD 相關的額外 5 維度 JSON scoring prompt
- `worker/src/prompts/resume-eval-rewrite.js`：streaming 優化建議 prompt
- 前端在 `/ai-lab/workspace` 新增「Resume Health Check」分頁/切換
- 分數面板 UI：各維度進度條 + 總分 + streaming 改寫建議
- Rate limit：5 req/IP/hour

## Capabilities

### New Capabilities
- `health-check-endpoint`: Worker `/health-check` endpoint，雙模式量化評分
- `health-check-ui`: 前端分數面板 + 模式選擇 + streaming 建議

### Modified Capabilities
<!-- 無 spec 層級的現有行為變更 -->

## Impact

- `worker/src/index.js`：新增 `/health-check` 路由處理
- `worker/src/prompts/resume-eval-base.js`：填入完整 prompt（原為佔位）
- `worker/src/prompts/resume-eval-jd.js`：填入完整 prompt（原為佔位）
- `worker/src/prompts/resume-eval-rewrite.js`：填入完整 prompt（原為佔位）
- `src/hooks/useHealthCheck.js`：新建
- `src/pages/WorkspacePage.js`：新增 Health Check 切換 tab
- 依賴：prompt-management change 與 ai-lab-navigation change 須先完成

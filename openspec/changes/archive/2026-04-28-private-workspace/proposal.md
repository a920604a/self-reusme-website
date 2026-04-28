## Why

開發者需要一套隨時可用的求職工作流工具：分析職缺契合度（JD Match）、生成客製化履歷與 Cover Letter（Job Apply）、打包下載完整應徵資料（Release）。目前只有 Claude Code skill 版本，無法在手機或其他裝置使用，且每次需要開啟 terminal。

## What Changes

- Worker 新增兩個 endpoint：`POST /match-jd`（fit 分析）、`POST /apply-job`（履歷生成）
- `worker/src/prompts/jd-match.js` 填入完整 JD fit 分析 prompt
- `worker/src/prompts/job-apply.js` 填入完整履歷客製化 prompt
- 前端 Workspace（`/ai-lab/workspace`）實作三步驟 Wizard：
  - Step 1：JD Match — 貼 JD → streaming Markdown 分析
  - Step 2：Job Apply — 基於 Step 1 → streaming 生成履歷 + Cover Letter → 下載 .md
  - Step 3：Release — 打包 Step 1 + Step 2 產物 → 下載 ZIP
- 新增 React hooks：`useJDMatch.js`、`useJobApply.js`
- Rate limit：10 req/IP/hour（KV）

## Capabilities

### New Capabilities
- `jd-match-endpoint`: Worker `/match-jd` endpoint，RAG-based JD 契合分析
- `job-apply-endpoint`: Worker `/apply-job` endpoint，客製化履歷生成
- `workspace-wizard`: 前端三步驟 Wizard UI，串接上述 endpoints

### Modified Capabilities
<!-- 無 spec 層級的現有行為變更 -->

## Impact

- `worker/src/index.js`：新增兩條路由處理
- `worker/src/prompts/jd-match.js`：填入完整 prompt（原為佔位）
- `worker/src/prompts/job-apply.js`：填入完整 prompt（原為佔位）
- `src/pages/WorkspacePage.js`：從骨架實作為完整 Wizard
- `src/hooks/useJDMatch.js`：新建
- `src/hooks/useJobApply.js`：新建
- 依賴：prompt-management change 須先完成

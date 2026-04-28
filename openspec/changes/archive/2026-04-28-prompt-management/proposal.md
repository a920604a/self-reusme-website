## Why

Worker prompt 字串目前直接寫在 `worker/src/index.js` 內，隨著 AI 功能增加（JD Match、Resume Health Check、Job Apply），維護與迭代 prompt 的成本將大幅上升。將 prompt 抽離為獨立模組，讓每個 AI 功能的 prompt 可以獨立版本控制與測試。

## What Changes

- 建立 `worker/src/prompts/` 目錄作為所有 prompt 的統一管理位置
- 將現有 `assemblePrompt()`（chat RAG）抽離至 `worker/src/prompts/query.js`
- 將現有 `assembleJDPrompt()`（JD Analyzer）抽離至 `worker/src/prompts/jd-analyzer.js`
- 建立後續功能的佔位 prompt 檔：`jd-match.js`、`resume-eval-base.js`、`resume-eval-jd.js`、`resume-eval-rewrite.js`、`job-apply.js`
- `worker/src/index.js` 改為 import 各 prompt 模組，移除 inline 函式

## Capabilities

### New Capabilities
- `prompt-modules`: Worker prompt 統一以 ES module 形式管理，每個檔案 export 一個 `assemble*Prompt()` 函式

### Modified Capabilities
<!-- 無 spec 層級的行為變更，純重構 -->

## Impact

- `worker/src/index.js`：移除 inline prompt 函式，改為 import
- `worker/src/prompts/*.js`：新增 7 個檔案
- 零 API 行為改變，零前端改動
- 後續所有 AI feature change 依賴此結構

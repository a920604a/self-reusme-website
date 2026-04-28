## 1. 建立目錄與搬移現有 Prompt

- [x] 1.1 建立 `worker/src/prompts/` 目錄
- [x] 1.2 建立 `worker/src/prompts/query.js`，將 `assemblePrompt()` 搬入並 rename 為 `assembleQueryPrompt()`，export 之
- [x] 1.3 建立 `worker/src/prompts/jd-analyzer.js`，將 `assembleJDPrompt()` 搬入並 rename 為 `assembleJDAnalyzerPrompt()`，export 之

## 2. 建立佔位 Prompt 檔

- [x] 2.1 建立 `worker/src/prompts/jd-match.js`，export `assembleJDMatchPrompt()` 佔位函式（throw Error）
- [x] 2.2 建立 `worker/src/prompts/resume-eval-base.js`，export `assembleResumeEvalBasePrompt()` 佔位函式
- [x] 2.3 建立 `worker/src/prompts/resume-eval-jd.js`，export `assembleResumeEvalJDPrompt()` 佔位函式
- [x] 2.4 建立 `worker/src/prompts/resume-eval-rewrite.js`，export `assembleResumeEvalRewritePrompt()` 佔位函式
- [x] 2.5 建立 `worker/src/prompts/job-apply.js`，export `assembleJobApplyPrompt()` 佔位函式

## 3. 更新 Worker 入口

- [x] 3.1 在 `worker/src/index.js` 頂部加入 import：`assembleQueryPrompt`、`assembleJDAnalyzerPrompt`
- [x] 3.2 移除 `worker/src/index.js` 內的 `assemblePrompt()` 與 `assembleJDPrompt()` 函式定義
- [x] 3.3 將 `handleQuery()` 中的 `assemblePrompt(...)` 呼叫改為 `assembleQueryPrompt(...)`
- [x] 3.4 將 `handleJDAnalysis()` 中的 `assembleJDPrompt(...)` 呼叫改為 `assembleJDAnalyzerPrompt(...)`

## 4. 驗證

- [x] 4.1 `npx wrangler dev` 本機啟動，smoke test：送出 chat 訊息確認正常回應
- [x] 4.2 smoke test：送出 JD Analyzer 請求確認串流正常
- [x] 4.3 `npx wrangler deploy` 部署至 Cloudflare

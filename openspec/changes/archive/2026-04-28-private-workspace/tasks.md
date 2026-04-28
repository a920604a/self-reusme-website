## 1. Worker — JD Match Endpoint

- [x] 1.1 `worker/src/prompts/jd-match.js`：填入完整 prompt，含角色設定（開發者視角）、四段 Markdown 輸出要求（契合度總覽、強項、落差、面試準備建議）、語言偵測指令
- [x] 1.2 `worker/src/index.js`：新增 `handleJDMatch(request, env, origin)` 函式，含輸入驗證（空值、5000 chars）、rate limit（10/IP/hour，key: `rl-private:match:{ip}:{hour}`）、embed → Vectorize（topK=8）→ prompt → stream
- [x] 1.3 `worker/src/index.js`：路由加入 `if (url.pathname === '/match-jd') return handleJDMatch(...)`

## 2. Worker — Job Apply Endpoint

- [x] 2.1 `worker/src/prompts/job-apply.js`：填入完整 prompt，含客製化履歷生成指令（基於 JD + match summary + 候選人 JSON 資料）、Cover Letter 生成指令、`<!-- RESUME_START -->`/`<!-- COVER_START -->` 分隔標記、語言偵測
- [x] 2.2 `worker/src/index.js`：新增 `handleJobApply(request, env, origin)` 函式，含輸入驗證（jd、matchSummary 必填）、rate limit（10/IP/hour，key: `rl-private:apply:{ip}:{hour}`）、直接組裝 prompt（不需 Vectorize，context 已在 matchSummary 中）→ stream
- [x] 2.3 `worker/src/index.js`：路由加入 `if (url.pathname === '/apply-job') return handleJobApply(...)`

## 3. Worker 部署與驗證

- [ ] 3.1 `npx wrangler dev` 本機測試 `/match-jd`：送出英文 JD，確認串流回應含四個段落
- [ ] 3.2 本機測試 `/match-jd`：送出中文 JD，確認回應以中文輸出
- [ ] 3.3 本機測試 `/apply-job`：送出 JD + matchSummary，確認串流含 RESUME_START 與 COVER_START 標記
- [ ] 3.4 `npx wrangler deploy` 部署至 Cloudflare

## 4. 前端 Hooks

- [x] 4.1 建立 `src/hooks/useJDMatch.js`：`{ result, isStreaming, error, match, stop }`，POST `/match-jd`，SSE 串流邏輯（參考 `useJDAnalysis.js`）
- [x] 4.2 建立 `src/hooks/useJobApply.js`：`{ resumeText, coverText, isStreaming, error, apply, stop }`，POST `/apply-job`，解析 `<!-- RESUME_START -->`/`<!-- COVER_START -->` 分隔，分別填入兩個 state

## 5. 前端 Wizard UI

- [x] 5.1 `src/pages/WorkspacePage.js`：實作 Wizard state（`activeStep`、`jdText`、`matchResult`、`resumeText`、`coverText`）
- [x] 5.2 Step 1 UI：JD 輸入 Textarea（5000 chars 上限）、Analyze 按鈕、streaming ReactMarkdown 結果區、Stop 按鈕
- [x] 5.3 Step 2 UI：自動顯示 JD 文字（唯讀）、「生成履歷」按鈕、streaming 結果分為履歷與 Cover Letter 兩欄、各自「下載 .md」按鈕（`Blob` + `URL.createObjectURL`）
- [x] 5.4 Step 3 UI：「Download ZIP」按鈕，使用 `jszip` 打包三個 .md → 觸發下載；「重新開始」按鈕清空所有 state
- [x] 5.5 `package.json`：新增 `jszip` 依賴（`npm install jszip --legacy-peer-deps`）

## 6. 端對端驗證

- [ ] 6.1 `npm start` 本機：完整跑一次 Wizard（英文 JD），確認三步驟皆可正常使用
- [ ] 6.2 確認中文 JD 輸出中文履歷
- [ ] 6.3 確認 Step 3 ZIP 下載正常，解壓後包含三個 .md 檔案
- [ ] 6.4 確認 Rate limit：10 次後顯示錯誤訊息
- [ ] 6.5 `npm run build && npm run deploy` 部署前端

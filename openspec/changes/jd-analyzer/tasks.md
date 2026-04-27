## 1. Worker — 新增 /analyze-jd 端點

- [x] 1.1 `worker/src/index.js`：新增 `assembleJDPrompt(docs, jdText)` 函式，輸出含四個 section 的 match prompt
- [x] 1.2 `worker/src/index.js`：新增 `handleJDAnalysis(request, env, origin)` 函式，含輸入驗證（空值、5000 chars 上限）
- [x] 1.3 `handleJDAnalysis`：實作獨立 rate limit（key: `rl-jd:{ip}:{hour}`，上限 5 req/hour）
- [x] 1.4 `handleJDAnalysis`：執行 embed → Vectorize（topK=8）→ assembleJDPrompt → stream llama-3-8b
- [x] 1.5 `worker/src/index.js`：在主路由加入 `if (url.pathname === '/analyze-jd') return handleJDAnalysis(...)`
- [x] 1.6 `npx wrangler dev` 本機測試：送出 JD 驗證串流回應結構正確
- [x] 1.7 `npx wrangler deploy` 部署至 Cloudflare

## 2. 前端 Hook

- [x] 2.1 新建 `src/hooks/useJDAnalysis.js`：單一 `result` string state + SSE 串流邏輯，endpoint `POST /analyze-jd`，body `{ jd: text }`
- [x] 2.2 `useJDAnalysis`：實作 `AbortController` 支援 Stop 功能

## 3. 前端頁面

- [x] 3.1 新建 `src/components/JDAnalyzer.js`：含說明文字、textarea（5000 chars 上限 + 即時字數顯示）、Analyze/Stop 按鈕
- [x] 3.2 `JDAnalyzer.js`：串接 `useJDAnalysis`，串流結果以 `ReactMarkdown` 渲染
- [x] 3.3 `JDAnalyzer.js`：分析完成後掃描 project ID，加 `rag-glow` class 並 `scrollIntoView`（複用 FloatingChatWidget 邏輯）
- [x] 3.4 `src/App.js`：新增路由 `<Route path="/jd-analyzer" element={<JDAnalyzer />} />`
- [x] 3.5 `src/components/Header.js`：nav 新增 "JD Analyzer" 連結

## 4. 驗證

- [x] 4.1 本機端對端測試：貼上英文 JD，確認串流報告結構正確（四個 section 皆出現）
- [x] 4.2 測試中文 JD，確認報告以中文輸出
- [x] 4.3 測試空白輸入：Analyze 按鈕為 disabled
- [x] 4.4 測試超長輸入（>5000 chars）：Worker 回 400，前端顯示錯誤訊息
- [x] 4.5 `npm run build && npm run deploy` 部署前端

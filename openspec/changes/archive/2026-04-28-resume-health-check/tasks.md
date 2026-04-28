## 1. Worker — Prompt 撰寫

- [x] 1.1 `worker/src/prompts/resume-eval-base.js`：撰寫 5 維度 JSON scoring prompt，強調「ONLY output valid JSON, no markdown fences」，輸出格式：`{ impact, technical_depth, readability, ownership, career_progression }` 各含 `score`（0–10）與 `reason`
- [x] 1.2 `worker/src/prompts/resume-eval-jd.js`：撰寫 JD 額外 5 維度 JSON scoring prompt，輸出格式：`{ ats_compatibility, job_relevance, differentiation, missing_keywords[], hiring_recommendation }`，其中 `ats_compatibility`/`job_relevance`/`differentiation` 含 `score` 與 `reason`
- [x] 1.3 `worker/src/prompts/resume-eval-rewrite.js`：撰寫 streaming 優化建議 prompt，輸入為 scoring 結果 JSON 字串，輸出為 Markdown，針對低分維度給出具體改寫建議與示例

## 2. Worker — Health Check Handler

- [x] 2.1 建立 `handleHealthCheck(request, env, origin)` 函式：解析 `{ mode, jd }` body，驗證 mode 值、jd（mode="jd" 時必填）
- [x] 2.2 實作 rate limit：5 req/IP/hour，key: `rl-private:health:{ip}:{hour}`
- [x] 2.3 實作候選人資料載入：`fetch` GitHub Pages 的 `profile.json`、`works.json`、`projects.json`、`skills.json`，組裝為 prompt context 字串
- [x] 2.4 實作 base JSON scoring call：呼叫 LLM（非 streaming）→ 解析 JSON → retry 一次（失敗 retry），二次失敗回傳 500
- [x] 2.5 Mode "jd"：`Promise.all` 並行呼叫 base scoring 與 jd scoring call，合併兩個 JSON 結果
- [x] 2.6 實作 rewrite streaming call：將合併後的 scores JSON 作為 context，呼叫 LLM（streaming）→ 回傳 SSE stream
- [x] 2.7 `worker/src/index.js`：路由加入 `if (url.pathname === '/health-check') return handleHealthCheck(...)`

## 3. Worker 驗證

- [ ] 3.1 `npx wrangler dev` 本機測試 mode="base"：確認回傳 JSON scores 正確結構，streaming 建議正常
- [ ] 3.2 本機測試 mode="jd"：送入 JD，確認 10 維度 scores + missing_keywords + streaming 建議
- [ ] 3.3 測試 JSON parsing retry：手動製造 LLM 輸出異常，確認 retry 機制觸發
- [ ] 3.4 `npx wrangler deploy` 部署至 Cloudflare

## 4. 前端 Hook

- [x] 4.1 建立 `src/hooks/useHealthCheck.js`：`{ scores, isLoadingScores, suggestions, isStreamingSuggestions, error, check, stop }`
  - POST `/health-check`
  - 先等待 JSON scores（response 分兩段：JSON lines 先到，再是 streaming text）
  - 解析 scores 後更新 state，接著繼續讀取 streaming suggestions

## 5. 前端 UI

- [x] 5.1 `src/pages/WorkspacePage.js`：新增 tab 切換（「Job Wizard」/ 「Resume Health Check」），預設顯示 Job Wizard
- [x] 5.2 建立 Health Check 區塊：模式選擇（兩個卡片按鈕：快速健檢 / JD 比對）
- [x] 5.3 Mode B 的 JD Textarea（5000 chars 上限 + 字數顯示），同 JD Analyzer 設計
- [x] 5.4 分數面板：`overall_score` 大字顯示，各維度以 Chakra UI `Progress` 元件渲染，低分（< 6）使用 `colorScheme="red"`
- [x] 5.5 Mode B 追加：`missing_keywords` 以 `Badge` 列表顯示在面板下方
- [x] 5.6 Streaming 建議區塊：`ReactMarkdown` 渲染，與 JD Analyzer 相同樣式

## 6. 端對端驗證

- [ ] 6.1 `npm start` 本機：測試 Mode A（快速健檢），確認 5 維度分數顯示正確，streaming 建議正常
- [ ] 6.2 測試 Mode B（JD 比對），確認 10 維度 + missing_keywords + streaming 建議
- [ ] 6.3 確認低分維度進度條為警示色
- [ ] 6.4 確認 Rate limit：5 次後顯示錯誤訊息
- [ ] 6.5 `npm run build && npm run deploy` 部署前端

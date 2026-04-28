## Context

Worker 已有 `/query`（chat RAG）與 `/analyze-jd`（JD Analyzer）兩個 streaming endpoint 作為參考實作。候選人資料已在 Vectorize index 中（由 `worker/scripts/ingest.js` 同步），可直接作為 RAG context。前端 `useStreamingChat` 與 `useJDAnalysis` hook 提供 SSE 串流的實作參考。

## Goals / Non-Goals

**Goals:**
- JD Match：輸入 JD → RAG 檢索候選人資料 → streaming Markdown（fit 分析、強項、落差、面試建議）
- Job Apply：以 JD Match 結果為 context → streaming 生成客製化履歷 Markdown + Cover Letter Markdown → 兩個獨立 .md 下載
- Release：client-side 打包（JSZip）將 Step 1 + Step 2 文字輸出壓縮為 .zip 下載
- 步驟之間的資料以 React state 傳遞（單頁 Wizard，不跨路由）

**Non-Goals:**
- 不需要後端儲存（無資料庫、無 KV 存檔）
- 不需要歷史紀錄功能
- Job Apply 不自動填寫線上申請表單

## Decisions

**決策 1：Wizard 狀態管理**
- 選擇：所有步驟資料存於 `WorkspacePage` 的 `useState`（`jdText`、`matchResult`、`applyResult`）
- 替代方案：Context 或 useReducer
- 理由：三個步驟的資料量小，單一元件 state 足夠；避免過度設計

**決策 2：/match-jd 的 context 來源**
- 選擇：同 `/analyze-jd`，embed JD → Vectorize topK=8 → 組裝 prompt
- 理由：候選人資料已在 Vectorize，RAG 是最快的實作路徑；prompt 角色改為「給開發者自己看」而非「給雇主看」

**決策 3：/apply-job 的輸入**
- 選擇：body 包含 `{ jd: string, matchSummary: string }`，Worker 將兩者組裝進 prompt
- 理由：前端把 Step 1 的 Markdown 結果直接傳給 Step 2，Worker 不需要維護 session state

**決策 4：Release 打包方式**
- 選擇：`jszip` 在瀏覽器端執行，打包三個 .md 文字（jd-match.md、resume.md、cover-letter.md）→ .zip
- 替代方案：後端打包
- 理由：純 client-side 無需 Worker 改動，資料量小，效能無問題

**決策 5：Rate limit**
- 選擇：10 req/IP/hour，key 格式：`rl-private:{endpoint}:{ip}:{hour}`
- 理由：私人工具使用頻率低，相比公開工具（20/min）更寬鬆但以 hour 計算

## Risks / Trade-offs

- [Risk] LLaMA 3-8B 生成的客製化履歷品質不穩定 → Mitigation：prompt 強制要求結構（section 標題），使用者下載後自行潤稿
- [Risk] Job Apply streaming 很長（完整履歷），超過 Worker 30s timeout → Mitigation：Worker Cloudflare AI 有自己的 streaming timeout，目前 JD Analyzer 已驗證可行；若有問題拆成兩個 call（resume + cover letter 分開）
- [Risk] jszip 在舊版 Safari 的相容性 → 可接受，開發者自用工具

## Open Questions

- Job Apply 的 prompt 語言：預設英文履歷？還是偵測 JD 語言？→ 建議偵測 JD 語言並回應同語言

## Context

LLaMA 3-8B 的 strict JSON output 可靠性有限，過去 JD Analyzer 使用純 streaming Markdown 規避此問題。Resume Health Check 需要結構化分數，必須設計 JSON call + streaming call 的兩階段架構，並處理 JSON parsing 失敗的 fallback。候選人資料以 JSON 形式存在（`public/data/*.json`），不需要解析非結構化文字。

## Goals / Non-Goals

**Goals:**
- Mode A（base）：5 維度量化評分 + streaming 優化建議
- Mode B（jd）：10 維度量化評分 + 關鍵字命中率 + streaming 優化建議
- 每次健檢最多 3 次 LLM call（base: 2 calls；jd: 3 calls）
- 前端顯示各維度進度條與總分

**Non-Goals:**
- 不實作語法/拼字的真正 NLP 檢查（由 LLM 主觀評估代替）
- 不儲存健檢歷史紀錄
- 不提供版本 A/B 比較

## Decisions

**決策 1：JSON Call 的輸入**
- 選擇：Worker 在 handler 內直接讀取候選人 JSON 資料（從 `public/data/` 的靜態路徑），組裝成 prompt context
- 替代方案：透過 Vectorize RAG 取得 context
- 理由：健檢需要完整結構化資料（所有工作經歷、所有專案），RAG 的 topK 取樣不完整；直接讀 JSON 更可靠

**決策 2：Worker 讀取靜態資料的方式**
- 選擇：Worker 在 `env.ASSETS`（Cloudflare Pages Functions）或直接 fetch GitHub Pages 的 JSON URL
- 替代方案：將資料存入 KV
- 理由：`fetch` GitHub Pages JSON 最簡單，TTL 由 Cache-Control 控制；若 Worker 獨立部署則 fetch `https://a920604a.github.io/self-reusme-website/data/*.json`

**決策 3：JSON parsing 失敗處理**
- 選擇：嘗試解析，失敗則 retry 一次；二次失敗則回傳 500 並附上 raw LLM output 供 debug
- 理由：LLaMA 3-8B 偶爾輸出格式不完整，一次 retry 可覆蓋大部分情況

**決策 4：Streaming 建議 Call 的輸入**
- 選擇：將 JSON scoring 結果（字串化）作為 context 傳入 rewrite prompt
- 理由：rewrite prompt 需要知道哪些維度分數低，才能針對性給建議

**決策 5：前端分數顯示**
- 選擇：Chakra UI `Progress` 元件顯示各維度進度條，無需外部圖表庫
- 替代方案：引入 Recharts 做雷達圖
- 理由：進度條實作簡單，雷達圖引入新依賴且在小螢幕上效果差

## Risks / Trade-offs

- [Risk] LLaMA 3-8B JSON 輸出不穩定導致解析失敗率高 → Mitigation：prompt 末尾強調「ONLY output valid JSON, no markdown fences」；考慮換用 `@cf/mistral/mistral-7b-instruct-v0.1` 測試比較
- [Risk] Fetch GitHub Pages JSON 在 Worker 中增加延遲（額外網路 round-trip）→ 可接受：JSON 檔案小（< 50KB），可加 `Cache-Control: max-age=3600` 減少重複 fetch
- [Risk] Mode B 的 3 次 LLM call 可能超過 30s Worker timeout → Mitigation：base call 與 jd call 改為 parallel（`Promise.all`），再串接 rewrite call

## Open Questions

- 是否要在 Mode B 中展示「缺少關鍵字」清單（`missing_keywords[]`）？→ 建議是，直接列在分數面板下方

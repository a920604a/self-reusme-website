## Why

作品集已有完整 RAG 架構（Vectorize + bge-m3 + llama-3-8b），但目前只有聊天 widget 使用它。JD Analyzer 將同樣的基礎設施轉化為訪客互動功能：招募者貼上職缺描述，AI 即時串流分析「這個候選人為什麼適合這個職位」，直接在網站上展示 AI 工程能力。

## What Changes

- `worker/src/index.js`：新增 `POST /analyze-jd` 端點，獨立 rate limit（5 req/IP/hour）、專屬 prompt，不快取
- `src/hooks/useJDAnalysis.js`：串流 hook，與 `useStreamingChat` 結構相同，endpoint 改為 `/analyze-jd`，不做 localStorage 持久化
- `src/components/JDAnalyzer.js`：新頁面，含 textarea 輸入、字數顯示、串流 Markdown 渲染、相關專案 highlight（複用 `rag-glow` 邏輯）
- `src/App.js`：新增路由 `/jd-analyzer`
- `src/components/Header.js`：nav 新增 "JD Analyzer" 連結

## Capabilities

### New Capabilities
- `jd-analysis-endpoint`: Worker 端新的 `/analyze-jd` API，負責接收 JD 文字、向量化、Vectorize 搜尋、組裝 match prompt、串流回應
- `jd-analyzer-page`: 前端 `/jd-analyzer` 頁面，讓訪客輸入 JD 並接收串流分析報告

### Modified Capabilities
<!-- 無現有 spec 需要修改 -->

## Impact

- `worker/src/index.js`：新增路由與 handler，沿用現有 KV / Vectorize / AI binding，無需新增 Cloudflare binding
- `src/hooks/`：新增 `useJDAnalysis.js`
- `src/components/`：新增 `JDAnalyzer.js`
- `src/App.js`：新增路由
- `src/components/Header.js`：nav 連結
- CORS：`/analyze-jd` 沿用現有 `ALLOWED_ORIGINS`，無需修改
- 無 breaking change

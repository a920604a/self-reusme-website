## Context

現有 RAG 架構（`worker/src/index.js`）：`POST /query` → embed → Vectorize → assemble prompt → stream llama-3-8b。rate limit 用 `RATE_LIMIT_KV`，key 格式 `rl:{ip}:{minute}`，上限 20 req/min。前端 `useStreamingChat.js`（位於 `src/components/`）負責 SSE 串流。

JD Analyzer 需要第二個 Worker 端點，消耗 token 量更大（topK 從 5 升至 8，JD 文字額外加入 prompt），需獨立 rate limit。

## Goals / Non-Goals

**Goals:**
- Worker 新增 `POST /analyze-jd`，獨立 rate limit 5 req/IP/hour
- 前端新增 `/jd-analyzer` 路由與對應頁面
- 串流分析報告，Markdown 渲染，相關專案自動 highlight

**Non-Goals:**
- 快取（每份 JD 幾乎唯一，cache hit rate ≈ 0）
- 多輪對話（單次分析，無歷史）
- 儲存分析記錄到 localStorage

## Decisions

**① Rate limit 策略**

`/analyze-jd` 使用 5 req/IP/hour，獨立 KV key：
```
rl-jd:{ip}:{hour}   (hour = Math.floor(Date.now() / 3600000))
```
不影響現有 `/query` 的 20 req/min 計數。

**② Prompt 結構（不重用 assemblePrompt）**

新建 `assembleJDPrompt(docs, jdText)` 函式，輸出固定 Markdown 結構：
```
## Key Requirements Match
## Relevant Projects
## Candidate Strengths for This Role
## Potential Gaps
```
語言跟隨 JD（prompt 中加 "Reply in the same language as the job description"）。

**③ topK = 8（vs /query 的 5）**

JD 可能涵蓋多個技術領域，需要更多 context chunks 才能完整對應。

**④ 前端 hook：新建 useJDAnalysis.js**

與 `useStreamingChat.js` 幾乎相同，差異：
- endpoint: `POST /analyze-jd`，body: `{ jd: text }`
- 無 localStorage 持久化
- 無多輪訊息陣列，只有單一 `result` string state

位置放在 `src/hooks/useJDAnalysis.js`（與 `useSubmit.js` 同層）。

**⑤ 相關專案 highlight**

複用 `FloatingChatWidget.js` 的現有邏輯：掃描 response 中的 project ID，加 `rag-glow` class 並 `scrollIntoView`。

## Risks / Trade-offs

- **辦公室 IP 共享** → 5 req/hour 在同一 IP 下多人使用時可能觸發，但 JD Analyzer 不是高頻功能，可接受
- **JD 輸入超長** → 前端限制 5000 chars，Worker 端額外驗證，超過回 400
- **Llama 語言切換品質** → 非英文 JD 的輸出品質依賴模型能力，無法保證，列為已知限制

## Open Questions

- 無

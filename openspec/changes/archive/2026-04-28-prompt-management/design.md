## Context

`worker/src/index.js` 目前包含兩個 inline prompt 組裝函式：`assemblePrompt()`（chat RAG）與 `assembleJDPrompt()`（JD Analyzer）。隨著 ai-lab-navigation、private-workspace、resume-health-check 等 change 陸續引入更多 AI 功能，prompt 數量將增加至 7 個以上，繼續放在同一檔案將難以維護。

## Goals / Non-Goals

**Goals:**
- 所有 prompt 函式移至 `worker/src/prompts/` 各自獨立檔案
- `worker/src/index.js` 只保留路由與 handler 邏輯
- 為後續功能預留佔位 prompt 檔，讓開發者知道在哪裡填入內容

**Non-Goals:**
- 不修改任何 prompt 內容（純搬移）
- 不新增任何 API endpoint
- 不改動前端任何程式碼

## Decisions

**決策 1：每個 prompt 一個 ES module 檔案**
- 選擇：`worker/src/prompts/query.js` export `assembleQueryPrompt(docs, query)`
- 替代方案：所有 prompt 放在單一 `prompts.js`
- 理由：單一檔案在 prompt 數量增加後仍會變成 God Object；每個檔案獨立讓 git diff 清晰

**決策 2：佔位檔 export 空函式並附 TODO 註解**
```js
// TODO: 在 private-workspace change 中填入完整 prompt
export function assembleJDMatchPrompt(docs, jd) {
  throw new Error('Not implemented');
}
```
- 理由：讓後續 change 的開發者明確知道要填什麼，避免遺漏

**決策 3：import 路徑使用相對路徑**
- `import { assembleQueryPrompt } from './prompts/query.js'`
- Cloudflare Worker 使用 ES modules，相對路徑是標準做法

## Risks / Trade-offs

- [Risk] 搬移過程中手誤改動 prompt 內容 → Mitigation：git diff 逐行確認，確保內容一字不差
- [Risk] 佔位檔被意外呼叫導致 Worker 500 → Mitigation：佔位檔 throw Error 而非 return 空字串，錯誤會在開發期被發現

## Migration Plan

1. 建立 `worker/src/prompts/` 目錄
2. 搬移現有兩個函式，確認內容不變
3. 建立 5 個佔位檔
4. 更新 `worker/src/index.js` 的 import
5. 本機 `npx wrangler dev` 跑 smoke test（chat + JD Analyzer 仍正常）
6. Deploy Worker

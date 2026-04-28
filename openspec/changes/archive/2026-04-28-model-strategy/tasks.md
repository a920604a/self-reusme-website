## 1. 更新 query prompt 模組

- [x] 1.1 在 `worker/src/prompts/query.js` 新增 `export const MODEL = '@cf/meta/llama-3.2-3b-instruct'`
- [x] 1.2 確認 `query.js` 同時 export `MODEL` 與 prompt template 函式

## 2. 更新 /query handler

- [x] 2.1 在 `worker/src/index.js` 的 `handleQuery` 中，import `MODEL` from `./prompts/query.js`
- [x] 2.2 將 `handleQuery` 內硬編碼的 `'@cf/meta/llama-3-8b-instruct'` 改為引用 `MODEL` 常數

## 3. 更新 /analyze-jd handler

- [x] 3.1 在 `worker/src/prompts/jd-analyzer.js` 新增 `export const MODEL = '@cf/zhipu-ai/glm-4.7-flash'`
- [x] 3.2 在 `worker/src/index.js` 的 `handleJDAnalysis` 中，import `MODEL` from `./prompts/jd-analyzer.js`
- [x] 3.3 將 `handleJDAnalysis` 內硬編碼的 `'@cf/meta/llama-3-8b-instruct'` 改為引用 `MODEL` 常數

## 4. 為未來 endpoint 的 prompt 模組加入 MODEL 常數

- [x] 4.1 在 `worker/src/prompts/jd-match.js` 新增 `export const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast'`
- [x] 4.2 在 `worker/src/prompts/job-apply.js` 新增 `export const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast'`
- [x] 4.3 在 `worker/src/prompts/resume-eval-base.js` 與 `resume-eval-jd.js` 新增 `export const MODEL = '@cf/zhipu-ai/glm-4.7-flash'`
- [x] 4.4 在 `worker/src/prompts/resume-eval-rewrite.js` 新增 `export const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast'`

## 5. 驗證與部署

- [x] 5.1 `cd worker && npx wrangler dev` 本機啟動，確認 `/query` 正常回應（Wrangler log 顯示使用 3B 模型）
- [x] 5.2 確認 `/analyze-jd` 正常回應（Wrangler log 顯示使用 glm-4.7-flash）
- [x] 5.3 `cd worker && npx wrangler deploy` 部署至 Cloudflare

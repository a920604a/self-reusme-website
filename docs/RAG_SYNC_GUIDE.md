# RAG Sync Guide — 更新 public/data 後如何同步

當你修改 `public/data/*.json`（新增專案、更新工作經歷、調整技能）後，AI Chat Widget 的知識庫不會自動更新。你需要手動重新 ingest，讓 Cloudflare Vectorize 反映最新內容。

---

## 什麼時候需要 re-ingest？

| 操作 | 需要 re-ingest？ | 需要 re-deploy Worker？ |
|------|----------------|------------------------|
| 新增 project | ✅ 是 | ❌ 否 |
| 修改 project 描述 / tags | ✅ 是 | ❌ 否 |
| 新增 / 修改 work experience | ✅ 是 | ❌ 否 |
| 修改 skills / tools | ✅ 是 | ❌ 否 |
| 修改 profile (bio, greeting) | ✅ 是 | ❌ 否 |
| 修改 Worker 邏輯 (`worker/src/index.js`) | ❌ 否 | ✅ 是 |
| 修改 prompt 結構 | ❌ 否 | ✅ 是 |
| 修改 React UI (`FloatingChatWidget.js`) | ❌ 否 | ❌ 否（只需 `npm run deploy`） |

---

## 準備工作（第一次才需要）

### 1. 安裝 Worker 依賴

```bash
cd worker
npm install
```

### 2. 建立 Vectorize index

```bash
npx wrangler vectorize create portfolio-index --dimensions=1024 --metric=cosine
```

### 3. 設定環境變數

```bash
export CLOUDFLARE_API_TOKEN=<your token>
export CLOUDFLARE_ACCOUNT_ID=<your account id>
```

取得 API Token：Cloudflare Dashboard → My Profile → API Tokens → Create Token（需要 `Workers AI:Read`、`Vectorize:Edit` 權限）

取得 Account ID：Cloudflare Dashboard → 右側側邊欄 → Account ID

---

## 每次更新 public/data 後的流程

### Step 1 — 修改 JSON 資料

編輯 `public/data/` 下的任一檔案：

```
public/data/
  projects.json    ← 專案
  works.json       ← 工作經歷
  skills.json      ← 技能
  profile.json     ← 個人簡介
```

### Step 2 — 重新 ingest 到 Vectorize

從 **repo 根目錄**執行：

```bash
cd worker
node scripts/ingest.js
```

成功輸出範例：
```
Building chunks from public/data...
Generated 18 chunks
Embedding batch 1/2...
  Upserting 10 vectors...
  Upserted: { mutationId: '...', count: 10 }
Embedding batch 2/2...
  Upserting 8 vectors...
  Upserted: { mutationId: '...', count: 8 }

Ingest complete! Vectors are in Cloudflare Vectorize.
```

> Ingest script 使用 **upsert**，相同 `id` 的向量會被覆蓋，不需要先刪除舊資料。

### Step 3 — 部署前端

```bash
# 回到 repo 根目錄
cd ..
npm run build
npm run deploy
```

或直接 push 到 `main`，GitHub Actions 會自動 build & deploy。

---

## 只修改 Worker 邏輯時

只有改 `worker/src/index.js`（例如調整 prompt、新增 CORS origin）才需要重新 deploy Worker：

```bash
cd worker
npx wrangler deploy
```

Worker deploy 與前端 deploy 互相獨立，不影響對方。

---

## 完整初始設定流程（新環境）

```bash
# 1. 安裝前端依賴
npm install --legacy-peer-deps

# 2. 安裝 Worker 依賴
cd worker && npm install && cd ..

# 3. 建立 Vectorize index
cd worker && npx wrangler vectorize create portfolio-index --dimensions=1024 --metric=cosine && cd ..

# 4. Ingest 資料
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=...
cd worker && node scripts/ingest.js && cd ..

# 5. Deploy Worker
cd worker && npx wrangler deploy && cd ..
# 取得 Worker URL，記下來

# 6. 設定前端環境變數
echo "REACT_APP_WORKER_URL=https://portfolio-rag.<account>.workers.dev" > .env

# 7. Build & deploy 前端
npm run build && npm run deploy

# 8. 在 GitHub Secrets 加入 REACT_APP_WORKER_URL（供 CI/CD 使用）
```

---

## 驗證 Vectorize 內容

查看目前 index 狀態：

```bash
cd worker
npx wrangler vectorize get portfolio-index
```

查詢某個向量是否存在：

```bash
npx wrangler vectorize get-vectors portfolio-index --ids project-llm-assistance
```

---

## Chunk ID 規則

ingest script 產生的向量 ID 規則如下，方便追蹤：

| 資料類型 | ID 格式 | 範例 |
|----------|---------|------|
| project | `project-{id}` | `project-llm-assistance` |
| work | `work-{id}` | `work-oomii-02` |
| skills | `skills` | `skills` |
| profile | `profile` | `profile` |

---

## 常見問題

**Q: ingest 後 AI 回答還是舊的？**  
A: Vectorize 更新幾乎即時，但 Worker 有 cache 機制。同一個 query 在 cache 過期前會回傳舊結果。清除方式：修改 query 措辭，或等 cache TTL 過期（預設由 Cloudflare Cache 控制）。

**Q: ingest script 出現 `Embed failed` 錯誤？**  
A: 確認 `CLOUDFLARE_API_TOKEN` 有 `Workers AI:Read` 權限，且 `CLOUDFLARE_ACCOUNT_ID` 正確。

**Q: ingest script 出現 `Upsert failed` 錯誤？**  
A: 確認 Vectorize index `portfolio-index` 已建立（`npx wrangler vectorize list`），且 token 有 `Vectorize:Edit` 權限。

**Q: 要刪除某個 project 的向量？**  
```bash
cd worker
npx wrangler vectorize delete-vectors portfolio-index --ids project-<id>
```

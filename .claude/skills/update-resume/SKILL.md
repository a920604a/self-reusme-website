# Skill: /update-resume

互動式履歷更新 — 引導修改 `public/data/*.json`，完成後自動同步 Vectorize 知識庫。

---

## Step 1 — 讀取現有資料

讀取以下四個檔案，建立完整的候選人現況快照：

```
public/data/profile.json
public/data/projects.json
public/data/works.json
public/data/skills.json
```

---

## Step 2 — 詢問要更新的項目

用 AskUserQuestion 詢問：

```
請問這次要更新哪個部分？
1. 個人資訊（bio、email、resume 連結）
2. 新增 / 修改專案
3. 新增 / 修改工作經歷
4. 技能清單（skills / tools / frameworks / tryLearn）
5. 以上多項
```

---

## Step 3 — 引導式 Q&A 收集內容

根據使用者選擇，逐項詢問需要的欄位。**每次只問一個問題，等待確認後再問下一個。**

### 若更新「個人資訊」：
- `greeting`：問候語（例如 "Hello, I am Yu-An Chen!"）
- `bio1`：職稱一行（例如 "Backend & AI/Data Engineer"）
- `bio2`：自我介紹段落
- `resumeDownload`：CakeResume 連結
- `email`：聯絡信箱

### 若新增「專案」：
依序收集：
- `id`（slug，例如 `rag-chatbot-2025`）
- `title`
- `date`（格式 `YYYY/MM-YYYY/MM` 或 `YYYY/MM-Now`）
- `category`（`Work` / `Side Project` / `Misc`）
- `tags`（陣列，例如 `["Python", "FastAPI", "GCP"]`）
- `description.background`
- `description.challenge`
- `description.solution`
- `description.outcome`
- `description.core_contributions`（選填，陣列）
- `repo`（選填）
- `reference`（選填）
- `images`（選填，路徑相對 `public/images/`）

### 若新增「工作經歷」：
依序收集：
- `id`（slug）
- `company`
- `position`
- `years`（格式 `YYYY/MM - YYYY/MM`）
- `description`（陣列，每條 bullet point）

### 若更新「技能清單」：
- 要新增還是移除？
- 屬於 `skills` / `tools` / `frameworks` / `tryLearn` 哪個類別？
- 若為 `skills`，需要 `percentage`（0–100）

---

## Step 4 — 確認變更內容

將所有收集到的變更整理成摘要，用 AskUserQuestion 請使用者確認：

```
以下是準備寫入的變更，請確認是否正確？
[顯示 diff 摘要]
確認請輸入 Y，取消請輸入 N，修改請說明要改哪裡
```

---

## Step 5 — 寫入 JSON 檔案

確認後，用 Edit 工具寫入對應的 JSON 檔案。

- 新增項目：append 到陣列末尾
- 修改項目：找到對應 id，in-place 更新
- 移除技能：從陣列中刪除對應項目

寫入後用 Read 再讀一次，確認 JSON 格式正確（無語法錯誤）。

---

## Step 6 — 同步 Vectorize 知識庫

JSON 更新後，執行 ingest script，讓 AI chat widget 的知識庫與網站內容保持一致：

```bash
cd worker && node scripts/ingest.js
```

若 `CLOUDFLARE_API_TOKEN` 或 `CLOUDFLARE_ACCOUNT_ID` 未設定，提示使用者先 export：

```bash
export CLOUDFLARE_API_TOKEN=<your token>
export CLOUDFLARE_ACCOUNT_ID=<your account id>
```

---

## Step 7 — 完成摘要

```
✅ 已更新：{列出修改的 JSON 檔案}
✅ Vectorize 同步完成（{N} 個 chunks 已重新 embed）
```

提示：若需要將網站本地預覽，執行 `npm start`。
若需要部署，push 到 main 即可觸發 GitHub Actions。

---

## 注意事項

- 每次只寫入使用者明確確認過的內容
- 不自動推論或補填使用者未提供的欄位（留 null 或略過）
- JSON 中的 `id` 欄位一旦設定不建議修改（影響 URL 路由與 Vectorize vector ID）
- ingest.js 執行需要網路連線與有效的 Cloudflare token

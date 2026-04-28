# Skill: /jd-match

JD 比對分析 + 客製化 Cover Letter

---

## Step 1 — 取得 JD 內容

詢問使用者提供以下其中一種：
- 直接貼上 JD 全文
- 提供網頁 URL（用 WebFetch 抓取）
- 提供本機檔案路徑（用 Read 讀取）

同時詢問：
- 公司名稱（slug 格式用於檔名，例如 `google`）
- 職位名稱（例如 `backend-engineer`）

---

## Step 2 — 讀取候選人資料

讀取以下四個檔案：

```
public/data/profile.json   → 基本資訊、bio、email
public/data/projects.json  → 所有專案（title / tags / description / date）
public/data/works.json     → 工作經歷（company / position / description bullets）
public/data/skills.json    → skills / tools / frameworks / tryLearn
```

---

## Step 3 — 適配度分析

依三個維度加權評分（各 0–100，合計加權總分）：

| 維度 | 權重 | 評估依據 |
|------|------|---------|
| 技術技能 | 40% | JD 要求的語言/工具/框架 vs `skills.json` |
| 工作經驗 | 35% | JD 要求的年資、領域、職責 vs `works.json` |
| 專案相關性 | 25% | JD 核心業務需求 vs `projects.json` 中最相關的前 3 個 |

每個維度輸出：
```
✅ 強項（JD 要求且候選人具備）
⚠️  部分符合（相關但不完全吻合）
❌ 落差（JD 要求但候選人較弱）
💡 面試應對建議（針對落差的誠實策略）
```

---

## Step 4 — 輸出分析報告

寫入：
```
output/jd-analysis/{company}-{position}-{YYYY-MM-DD}.md
```

報告結構：
```markdown
# JD 適配分析 — {公司} · {職位}

**日期**: {date}
**JD 來源**: {url 或 "貼上文字"}
**綜合適配分**: {score}/100

## 技術技能（40%）｜分數：{n}/100
...

## 工作經驗（35%）｜分數：{n}/100
...

## 專案相關性（25%）｜分數：{n}/100
最相關專案：
- [{title}]({repo or reference}) — {一句說明}
...

## 強項摘要
...

## 落差與面試應對策略
...

## 推薦在面試中主動提及的專案
...
```

---

## Step 5 — 詢問是否產出求職信

詢問：
1. 是否需要求職信？（Y/N）
2. 語言：中文 / English / 雙語
3. 語氣：專業正式 / 積極主動 / 簡潔直接

若同意，產出並寫入：
```
output/cover-letters/{company}-{position}-{YYYY-MM-DD}.md
```

求職信結構：
- **開場**：引用 JD 關鍵字，說明為何對這個職位感興趣
- **主體一**：最相關的 1–2 段工作經歷（從 `works.json` 取材）
- **主體二**：最相關的 1–2 個專案（從 `projects.json` 取材，附 repo/reference 連結）
- **結尾**：主動表達意願，附 email（從 `profile.json` 取）與 portfolio 連結

---

## Step 6 — 完成摘要

```
✅ 分析報告：output/jd-analysis/{company}-{position}-{date}.md
✅ 求職信：output/cover-letters/{company}-{position}-{date}.md
```

提示使用者可接著執行 `/job-apply` 產出客製化履歷，或 `/job-release` 歸檔本次應徵資料。

---

## 注意事項

- 所有分析基於候選人**實際**經歷，不捏造或誇大技能
- 回應語言跟隨使用者輸入語言（JD 是英文就用英文分析，中文就用中文）
- 若 JD 要求技術在候選人資料中完全找不到，如實標記 ❌，給誠實的應對建議

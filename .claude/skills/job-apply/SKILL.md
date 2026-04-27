# Skill: /job-apply

針對目標職缺，產出客製化履歷文件與應徵套件。
**不建立 git 分支，不修改原始 JSON，所有輸出存於 `output/applications/`。**

---

## Step 1 — 取得分析報告

詢問使用者：
- 是否已執行過 `/jd-match`？
  - **是** → 提供 `output/jd-analysis/` 中的報告檔案路徑，用 Read 讀取
  - **否** → 先執行 `/jd-match`，完成後再回到此 skill

從報告中取得：
- 公司名稱 / 職位名稱
- 三個維度的分析結果（強項 / 部分符合 / 落差）
- 最相關專案清單

---

## Step 2 — 讀取候選人完整資料

```
public/data/profile.json
public/data/projects.json
public/data/works.json
public/data/skills.json
```

---

## Step 3 — 引導客製化方向

用 AskUserQuestion 逐步確認以下客製化策略：

**Q1：Professional Summary 方向**
```
根據 JD，建議強調以下方向：
[列出 2–3 個建議切角，例如「強調 MLOps 實務經驗」「突出雲端基礎設施背景」]
請選擇或說明你希望的定位方向：
```

**Q2：重點工作經歷**
```
以下工作經歷與 JD 最相關：
1. {position} @ {company}（{years}）— 符合：{原因}
2. {position} @ {company}（{years}）— 符合：{原因}
哪些要重點呈現？排列順序是否調整？
```

**Q3：重點專案**
```
以下專案與 JD 最相關：
1. {title}（{tags}）— 符合：{原因}
2. {title}（{tags}）— 符合：{原因}
哪些要在履歷中優先呈現？
```

**Q4：技能強調**
```
JD 特別要求的技術：{列表}
你的對應技能：{列表}
是否有要額外補充說明的工具或經驗？
```

---

## Step 4 — 產出客製化履歷 Markdown

根據確認的客製化方向，產出一份完整的履歷文件：

寫入：
```
output/applications/{company}-{position}-{YYYY-MM-DD}/resume.md
```

文件結構：
```markdown
# {name} — {客製化職稱，針對 JD 調整}

**Email**: {email} | **Portfolio**: {resumeDownload} | **GitHub**: (from works/projects)

## Professional Summary
（2–3 句，針對 JD 關鍵字與強調方向客製，基於 bio1/bio2 改寫）

## Core Skills
（從 skills.json 篩選最相關的技術，按 JD 重要性排序）

Languages: ...
Tools & Infrastructure: ...
Frameworks: ...

## Work Experience
（只列與 JD 最相關的職位，description bullets 依 JD 關鍵字重新排序，相關的 bullet 移到最前）

### {position} | {company} | {years}
- ...

## Relevant Projects
（只列確認的重點專案，description 只取 solution + outcome 精簡版）

### {title} ({date}) [{tags}]
{精簡版描述，一段}
→ Repo / Reference 連結（若有）

## Education
（直接從 education.json 取，不客製）
```

---

## Step 5 — 產出應徵摘要

寫入：
```
output/applications/{company}-{position}-{YYYY-MM-DD}/summary.md
```

內容：
```markdown
# 應徵摘要 — {公司} · {職位}

**日期**: {date}
**JD 分析報告**: output/jd-analysis/{相對路徑}
**求職信**: output/cover-letters/{相對路徑}（若有）

## 客製化策略
- Summary 定位：{選定方向}
- 重點強調工作：{列表}
- 重點展示專案：{列表}
- 特別突出技能：{列表}

## 與原始履歷的差異
- {列出主要差異點}

## 面試準備重點（來自 jd-match 分析）
- {列出落差的應對策略}
```

---

## Step 6 — 完成摘要

```
output/applications/{company}-{position}-{date}/
├── resume.md        ← 客製化履歷
└── summary.md       ← 應徵策略摘要

✅ 原始 JSON 資料未被修改
```

提示：完成後可執行 `/job-release` 將本次應徵資料完整歸檔。

---

## 注意事項

- 客製化內容基於候選人**實際**經歷，不捏造技能或誇大成果
- 落差項目不從履歷中刻意迴避，而是在 summary.md 記錄面試應對策略
- resume.md 是給使用者自行複製 / 參考的草稿，不直接取代 CakeResume

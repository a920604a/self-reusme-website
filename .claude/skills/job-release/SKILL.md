# Skill: /job-release

封存完整應徵資料包 — 將 JD 分析、求職信、客製化履歷整理成一個乾淨的歸檔目錄。

---

## Step 1 — 確認本次應徵資訊

詢問使用者：
- 公司名稱與職位名稱（或從現有 `output/applications/` 目錄列出選項）
- 是否已完成以下步驟（確認檔案存在）：
  - `/jd-match` → `output/jd-analysis/{company}-{position}-{date}.md`
  - `/job-apply` → `output/applications/{company}-{position}-{date}/`
  - 求職信（選填）→ `output/cover-letters/{company}-{position}-{date}.md`

用 Read 逐一確認這些檔案是否存在。若缺少關鍵檔案，提示使用者先執行對應 skill。

---

## Step 2 — 建立歸檔目錄

```
output/releases/{company}-{position}-{YYYY-MM-DD}/
```

---

## Step 3 — 複製應徵資料

將以下檔案複製（或移動）到歸檔目錄：

```
output/releases/{company}-{position}-{date}/
├── jd-analysis.md          ← 來自 output/jd-analysis/
├── cover-letter.md         ← 來自 output/cover-letters/（若存在）
├── resume.md               ← 來自 output/applications/{...}/resume.md
└── summary.md              ← 來自 output/applications/{...}/summary.md
```

用 Read 讀取每個來源檔案，再用 Write 寫入歸檔路徑（保持內容完整，不做裁剪）。

---

## Step 4 — 產出 README 封面頁

寫入：
```
output/releases/{company}-{position}-{date}/README.md
```

內容：
```markdown
# 應徵資料包 — {公司} · {職位}

**封存日期**: {date}
**應徵狀態**: 準備中 / 已投遞 / 面試中 / 結案（請手動更新）

## 本包含內容

| 檔案 | 說明 |
|------|------|
| `jd-analysis.md` | JD 適配度分析報告（綜合分：{score}/100） |
| `resume.md` | 針對本職缺客製化的履歷草稿 |
| `cover-letter.md` | 客製化求職信 |
| `summary.md` | 應徵策略與面試準備重點 |

## 關鍵資訊

- **CakeResume（正式履歷）**: {resumeDownload from profile.json}
- **Portfolio**: {greeting/bio1 from profile.json implied URL}
- **聯絡信箱**: {email from profile.json}

## 客製化摘要

（從 summary.md 的「客製化策略」區塊自動摘錄）

## 後續追蹤

- [ ] 投遞日期：___
- [ ] 回覆狀態：___
- [ ] 面試日期：___
- [ ] 備註：___
```

---

## Step 5 — 完成摘要

列出歸檔目錄完整結構：

```
output/releases/{company}-{position}-{date}/
├── README.md
├── jd-analysis.md
├── resume.md
├── cover-letter.md   （若存在）
└── summary.md

✅ 歸檔完成
```

詢問使用者是否要 git commit 這個歸檔（提供建議的 commit message）：

```
git add output/releases/{company}-{position}-{date}/
git commit -m "release({company}): archive application for {position} ({date})"
```

若使用者同意，執行 commit；若不需要，跳過。

---

## 注意事項

- 本 skill 只做**複製歸檔**，不修改任何 `public/data/` 或 `src/` 下的原始檔案
- `output/` 目錄建議加入 `.gitignore`（個人應徵資料不需要進 repo），或視個人習慣決定是否追蹤
- README 中的「應徵狀態」欄位需使用者手動更新

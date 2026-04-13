# 使用教學：如何將此模板變成你自己的個人履歷網站

本文件說明如何 Fork 此專案、填寫個人資料、替換圖片，並部署成自己的個人作品集網站。

---

## 目錄

1. [快速開始](#1-快速開始)
2. [填寫個人資料：`public/propData.json` 完整說明](#2-填寫個人資料propDatajson-完整說明)
3. [替換大頭照與專案圖片](#3-替換大頭照與專案圖片)
4. [修改社群連結 (Header)](#4-修改社群連結-header)
5. [自訂主題色彩（選填）](#5-自訂主題色彩選填)
6. [設定 `package.json` 的 homepage](#6-設定-packagejson-的-homepage)
7. [部署到 GitHub Pages](#7-部署到-github-pages)
8. [其他部署方式](#8-其他部署方式)
9. [完整 `propData.json` 最小範例](#9-完整-propdatajson-最小範例)
10. [常見問題 FAQ](#10-常見問題-faq)

---

## 1. 快速開始

### Step 1 — Fork 並 Clone

1. 前往 GitHub 頁面，點擊右上角 **Fork**
2. 將 fork 後的 repo clone 到本機：

```bash
git clone https://github.com/<你的帳號>/self-reusme-website.git
cd self-reusme-website
npm install
npm start
```

3. 開啟瀏覽器進入 [http://localhost:3000](http://localhost:3000)，確認網站正常顯示

> 此時顯示的仍是原作者資料，接下來的步驟會教你如何全部替換成自己的內容。

---

## 2. 填寫個人資料：`propData.json` 完整說明

**唯一需要編輯的資料檔案**：`public/propData.json`

此 JSON 檔控制整個網站顯示的所有內容，包含：首頁介紹、作品集、工作經歷、技能、學歷。

---

### 2.1 首頁基本資訊（Landing Section）

```json
{
  "greeting": "Hello, I am 你的名字!",
  "bio1": "你的職稱，例如：Frontend Developer",
  "bio2": "一段關於你自己的介紹，100 字以內為佳。",
  "resumeDownload": "https://你的履歷連結（CakeResume、PDF 網址等）"
}
```

| 欄位 | 顯示位置 | 說明 |
|------|----------|------|
| `greeting` | 首頁大標題 | 歡迎語或自我介紹開場白 |
| `bio1` | 首頁角色標籤 | 簡短職稱，顯示在名字上方 |
| `bio2` | 首頁副標文字 | 較完整的自我介紹段落 |
| `resumeDownload` | Download Resume 按鈕 | 點擊後開啟的履歷連結 |

---

### 2.2 `projects[]` — 作品集

每個專案為 `projects` 陣列中的一個物件：

```json
{
  "id": "my-project",
  "title": "我的專案名稱",
  "date": "2024/01-2024/06",
  "category": "Side Project",
  "tags": ["Python", "FastAPI", "Docker"],
  "description": {
    "background": "為什麼做這個專案？背景說明。",
    "challenge": "遇到什麼挑戰？",
    "solution": "如何解決？",
    "core_contributions": [
      "**貢獻一**：做了什麼",
      "**貢獻二**：做了什麼"
    ],
    "outcome": "達成了什麼成果？量化指標更好。"
  },
  "images": [
    "my-project/flow.png",
    "my-project/arch.png"
  ],
  "uiImages": [
    "my-project/ui.png"
  ],
  "repo": "https://github.com/你的帳號/my-project",
  "reference": "https://相關連結（選填）"
}
```

#### 欄位說明

| 欄位 | 必填 | 類型 | 說明 |
|------|------|------|------|
| `id` | ✅ | string | 唯一識別碼，會用於 URL（`/projects/my-project`）。**只能使用小寫英文、數字、連字號**，不要有空白或特殊符號 |
| `title` | ✅ | string | 專案顯示名稱 |
| `date` | ✅ | string | 日期範圍，格式建議 `"YYYY/MM-YYYY/MM"` 或 `"YYYY/MM-Now"` |
| `category` | ✅ | string | 分類：`"Work"`、`"Side Project"`、`"Misc"` 三選一 |
| `tags` | ✅ | string[] | 技術標籤，顯示為 badge |
| `description` | ✅ | object | 詳見下方 |
| `images` | ✅ | string[] | 圖片路徑，相對於 `public/images/` 目錄 |
| `uiImages` | ❌ | string[] | UI 截圖路徑（可省略） |
| `repo` | ❌ | string 或 object[] | GitHub 連結，可以是單一字串或多個 repo 的陣列（見下方） |
| `reference` | ❌ | string | 外部參考連結 |

#### `category` 分類說明

- `"Work"` — 工作中參與的專案，會優先顯示在首頁輪播
- `"Side Project"` — 個人 Side Project，同樣會出現在首頁輪播
- `"Misc"` — 其他雜項，僅出現在 Projects 頁面

> 首頁輪播（Carousel）只顯示 `category` 為 `"Work"` 或 `"Side Project"` 的專案，依日期由新到舊排列，最多顯示 5 個。

#### `description` 物件欄位

| 欄位 | 說明 |
|------|------|
| `background` | 專案背景、動機 |
| `challenge` | 面臨的挑戰或問題 |
| `solution` | 解決方案說明 |
| `core_contributions` | （選填）列點式核心貢獻，支援 `**粗體**` markdown |
| `outcome` | 成果與影響，建議量化 |

#### 多個 `repo` 連結

如果一個專案有多個 repo，可以用陣列格式：

```json
"repo": [
  { "frontend": "https://github.com/你/frontend-repo" },
  { "backend": "https://github.com/你/backend-repo" }
]
```

---

### 2.3 `works[]` — 工作經歷

```json
{
  "id": "company-a-senior",
  "company": "公司名稱",
  "position": "資深工程師",
  "years": "2022/05-Now",
  "description": [
    "負責 XX 系統的開發與維護，使用 Python / FastAPI",
    "與 PM、設計師協作，確保功能如期交付",
    "導入 Docker 容器化部署，縮短部署時間 50%"
  ]
}
```

| 欄位 | 必填 | 說明 |
|------|------|------|
| `id` | ✅ | 唯一識別碼，用於 `/works/:id` 路由 |
| `company` | ✅ | 公司名稱 |
| `position` | ✅ | 職稱 |
| `years` | ✅ | 在職期間，格式 `"YYYY/MM-YYYY/MM"` 或 `"YYYY/MM-Now"` |
| `description` | ✅ | 字串陣列，每個字串為一條工作描述（顯示為列表） |

> **建議**：每條描述以「動詞開頭 + 技術 + 成果」的格式撰寫，例如「導入 Prometheus 監控，主動偵測系統異常，MTTR 縮短 40%」。

---

### 2.4 `skills[]` — 程式語言能力

```json
"skills": [
  { "name": "Python",     "level": "75%" },
  { "name": "JavaScript", "level": "60%" },
  { "name": "Go",         "level": "40%" }
]
```

| 欄位 | 說明 |
|------|------|
| `name` | 語言名稱（需與 `SkillSection.js` 中的 icon 名稱對應，才能顯示 icon） |
| `level` | 熟練度百分比字串，例如 `"75%"`，控制進度條長度 |

#### 目前支援自動顯示 icon 的語言

`Python`、`C#`、`C++`、`JavaScript`、`SQL`、`Shell Script`

> 填入不在清單中的語言，進度條仍會正常顯示，但不會有 icon 圖示。

---

### 2.5 `tools[]` — 工具清單

```json
"tools": ["Git", "Docker", "PostgreSQL", "Redis", "GCP", "Ansible"]
```

純字串陣列。目前支援自動顯示 icon 的工具：

`Git`, `PostgreSQL`, `MySQL`, `Redis`, `MongoDB`, `Docker`, `Ansible`, `Airflow`, `Ubuntu`, `Prometheus`, `Grafana`, `GCP`, `MLflow`, `Unity`

> 填入不在清單中的工具名稱，仍會顯示文字標籤，但沒有 icon。

---

### 2.6 `frameworks[]` — 框架清單

```json
"frameworks": ["React", "FastAPI", "Flask", "PyTorch"]
```

目前支援自動顯示 icon 的框架：`React`、`FastAPI`、`PyTorch`、`Flask`

---

### 2.7 `tryLearn[]` — 正在學習的技術（選填）

```json
"tryLearn": ["K8s", "Kafka", "Terraform"]
```

顯示在 Skills 區塊的「Exploring」虛線卡片。可省略或設為空陣列 `[]`。

---

### 2.8 `educationData[]` — 學歷

```json
"educationData": [
  {
    "school": "National Taiwan University",
    "major": "Computer Science",
    "duration": "2018-2022"
  },
  {
    "school": "National Taiwan University",
    "major": "Mathematics",
    "duration": "2014-2018"
  }
]
```

| 欄位 | 說明 |
|------|------|
| `school` | 學校名稱（含學位，例如 `"Master of ..."` 或 `"Bachelor of ..."`） |
| `major` | 主修科系 |
| `duration` | 就學年份，例如 `"2018-2022"` |

---

## 3. 替換大頭照與專案圖片

### 大頭照

將你的大頭照命名為 `profilepic.jpeg` 並放到：

```
public/images/portfolio/_profile/profilepic.jpeg
```

> 圖片名稱固定為 `profilepic.jpeg`，尺寸建議正方形，至少 200×200 px。

---

### 專案圖片

每個專案的圖片放在：

```
public/images/portfolio/<project-id>/
```

每個專案通常包含以下圖片（依你的 `propData.json` 中 `images` 和 `uiImages` 陣列決定）：

| 檔名 | 用途 | 建議尺寸 |
|------|------|----------|
| `flow.png` | 流程圖、系統運作示意 | 16:9，寬 1200px |
| `arch.png` | 架構圖 | 16:9，寬 1200px |
| `ui.png` | UI 截圖（選填） | 自由，寬 1200px |

範例：假設你的專案 id 是 `my-blog`：

1. 建立目錄 `public/images/portfolio/my-blog/`
2. 放入 `flow.png`、`arch.png`（至少這兩張）
3. 在 `propData.json` 中設定：

```json
"images": ["my-blog/flow.png", "my-blog/arch.png"]
```

> **注意**：`images` 路徑是相對於 `public/images/portfolio/` 目錄，不需要寫前面的路徑。

---

## 4. 修改社群連結 (Header)

編輯 `src/components/Header.js` 第 13–18 行的 `socials` 陣列：

```js
const socials = [
  { icon: faEnvelope, url: "mailto:你的Email",                      label: "Email" },
  { icon: faGithub,   url: "https://github.com/你的帳號",            label: "GitHub" },
  { icon: faLinkedin, url: "https://www.linkedin.com/in/你的profile", label: "LinkedIn" },
  { icon: faMedium,   url: "https://medium.com/@你的帳號",            label: "Medium" },
];
```

不需要的社群連結直接刪除整行即可。

---

## 5. 自訂主題色彩（選填）

編輯 `src/theme.js` 即可調整顏色與字型。目前預設主題：

| 用途 | 預設值 |
|------|--------|
| 背景色（深） | `#0b1326`（深海軍藍） |
| 強調色 | `#c0c1ff`（淺紫） |
| 次強調色 | `#5de6ff`（青藍） |
| 標題字型 | Manrope |
| 內文字型 | Inter |
| 程式碼字型 | JetBrains Mono |

字型是透過 Google Fonts 載入，import 在 `public/index.html`。

---

## 6. 設定 `package.json` 的 homepage

在 `package.json` 中修改 `homepage` 欄位為你的 GitHub Pages 網址：

```json
"homepage": "https://<你的GitHub帳號>.github.io/<你的Repo名稱>"
```

例如：

```json
"homepage": "https://johndoe.github.io/my-portfolio"
```

> **此步驟影響靜態資源路徑，不設定會導致圖片與 JS/CSS 無法載入。**

---

## 7. 部署到 GitHub Pages

```bash
npm run build
npm run deploy
```

`npm run deploy` 會自動將 `build/` 目錄推送到 `gh-pages` branch。

接著在 GitHub Repo 的 **Settings → Pages**：
- Source 選擇 `gh-pages` branch
- 路徑選 `/ (root)`
- 儲存後等 1~2 分鐘，網站就會上線

> 之後每次更新內容，只需重新執行 `npm run build && npm run deploy`。

---

## 8. 其他部署方式

| 平台 | 方式 |
|------|------|
| **Netlify** | 連結 GitHub repo，Build command 設 `npm run build`，Publish directory 設 `build` |
| **Vercel** | 連結 GitHub repo，Framework preset 選 `Create React App` |
| **任意靜態主機** | 執行 `npm run build` 後，上傳 `build/` 目錄的所有內容 |

> 此專案使用 `HashRouter`（URL 含 `#`），所有靜態主機均可正常使用，**不需要伺服器端 routing 設定**。

---

## 9. 完整 `propData.json` 最小範例

以下是最精簡可用的 `propData.json`，可直接複製並替換成自己的資料：

```json
{
  "greeting": "Hello, I am Jane Doe!",
  "bio1": "Full Stack Developer",
  "bio2": "Passionate about building scalable web applications and clean code.",
  "resumeDownload": "https://your-resume-link.com",

  "projects": [
    {
      "id": "my-first-project",
      "title": "My First Project",
      "date": "2024/01-2024/06",
      "category": "Side Project",
      "tags": ["React", "Node.js", "PostgreSQL"],
      "description": {
        "background": "Wanted to build a full-stack app to learn React.",
        "challenge": "Handling state management across multiple pages.",
        "solution": "Used React Context API and custom hooks.",
        "outcome": "Completed the project and deployed it on Vercel."
      },
      "images": [
        "my-first-project/flow.png",
        "my-first-project/arch.png"
      ],
      "repo": "https://github.com/janedoe/my-first-project"
    }
  ],

  "works": [
    {
      "id": "company-a",
      "company": "Company A",
      "position": "Software Engineer",
      "years": "2022/07-Now",
      "description": [
        "Developed and maintained RESTful APIs using Node.js and Express.",
        "Collaborated with cross-functional teams to deliver features on time."
      ]
    }
  ],

  "skills": [
    { "name": "JavaScript", "level": "80%" },
    { "name": "Python",     "level": "60%" }
  ],

  "tools": ["Git", "Docker", "PostgreSQL"],
  "frameworks": ["React", "FastAPI"],
  "tryLearn": ["K8s", "Terraform"],

  "educationData": [
    {
      "school": "National Taiwan University",
      "major": "Computer Science",
      "duration": "2018-2022"
    }
  ]
}
```

---

## 10. 常見問題 FAQ

**Q：圖片沒有顯示怎麼辦？**

確認：
1. 圖片放在 `public/images/portfolio/<project-id>/` 目錄下
2. `propData.json` 中的路徑只寫 `<project-id>/filename.png`，不要加前綴
3. `package.json` 的 `homepage` 已正確設定

---

**Q：我想加入 `tools` 或 `frameworks` 中沒有 icon 的工具，可以嗎？**

可以！直接在陣列中新增名稱字串，文字標籤仍會正常顯示。若想加上 icon，可以在 `src/components/SkillSection.js` 的 `Icons` 物件中新增對應的 CDN 圖片連結。

---

**Q：`category` 除了 `Work`、`Side Project`、`Misc` 還可以自訂嗎？**

可以填入任意字串，但 **首頁輪播（Carousel）只識別 `Work` 和 `Side Project`**，其他分類的專案只會出現在 `/projects` 頁面。若要修改此行為，請編輯 `src/App.js` 中的 `recommendedProjects` 過濾邏輯。

---

**Q：一個專案有多個 GitHub repo 怎麼設定？**

使用物件陣列格式：

```json
"repo": [
  { "frontend": "https://github.com/你/frontend" },
  { "backend": "https://github.com/你/backend" }
]
```

---

**Q：`core_contributions` 欄位可以用 markdown 嗎？**

支援 `**粗體**` 語法，會在詳情頁中正確渲染。其他 markdown 語法尚未支援。

---

**Q：我不想顯示 `tryLearn`（Exploring）區塊怎麼辦？**

設為空陣列即可：

```json
"tryLearn": []
```

---

**Q：部署後網站路由正常但圖片都消失？**

檢查 `package.json` 的 `homepage` 是否正確設定為你自己的 GitHub Pages URL。這個設定影響 React 靜態資源的 base path。

---

如有其他問題，歡迎在 GitHub Issues 提問。

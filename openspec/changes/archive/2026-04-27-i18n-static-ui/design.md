## Context

所有靜態 UI 文字目前硬寫在各元件中（中文）。專案無任何 i18n 基礎設施。目標是最小成本支援繁中/英文切換，不引入外部 i18n 函式庫，不碰 JSON 資料。

## Goals / Non-Goals

**Goals:**
- Nav、section 標題、按鈕、placeholder、說明文字可切換繁中/英文
- 切換選擇持久化至 localStorage
- 實作成本低：不引入 react-i18next 等外部套件

**Non-Goals:**
- JSON 資料內容（projects、works、skills 等）語言切換
- 超過兩種語言
- URL-based locale（/en/、/zh/）

## Decisions

**① 不引入 i18n 函式庫**

專案規模小，只需兩語言，用自製 `useLocale` hook + 兩份靜態 JS 物件即可。引入 react-i18next 會增加 bundle size 和學習成本，ROI 不足。

**② 字串檔結構**

```
src/i18n/
  zh.js   ← 預設（繁中）
  en.js   ← 英文
```

每個檔案 export 一個巢狀物件，key 對應元件/section：
```js
export default {
  nav: { home: '首頁', projects: '作品集', ... },
  landing: { greeting: '你好', ... },
  ...
}
```

**③ useLocale hook**

```js
// src/hooks/useLocale.js
const [locale, setLocale] = useState(
  localStorage.getItem('locale') || 'zh'
);
```

透過 React Context 或 prop drilling 傳遞。考量到元件層數不深，先用 Context 避免 prop drilling 污染。

**④ Header 切換按鈕**

`ZH | EN` 文字按鈕，放在 Header 右側（與 light/dark 切換並排）。

## Risks / Trade-offs

- **漏翻**：初版可能有遺漏的靜態文字，建議實作後用英文模式目測全站
- **Context re-render**：locale 切換會觸發所有消費 Context 的元件重渲染，但對靜態展示網站無效能問題

## Open Questions

- 無

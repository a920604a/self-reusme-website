## 1. 建立 i18n 基礎設施

- [x] 1.1 新建 `src/i18n/zh.js`：收錄所有靜態 UI 文字的繁中版本（nav、section 標題、按鈕、placeholder、說明文字）
- [x] 1.2 新建 `src/i18n/en.js`：對應的英文版本
- [x] 1.3 新建 `src/hooks/useLocale.js`：管理 `locale` state，初始值從 localStorage 讀取（預設 `'en'`），提供 `setLocale` 並在切換時寫入 localStorage
- [x] 1.4 新建 `src/context/LocaleContext.js`：用 React Context 提供 `{ t, locale, setLocale }`，`t` 為取字串的 helper function

## 2. 接入 App

- [x] 2.1 `src/App.js`：包裹 `LocaleProvider`，讓所有子元件可消費 locale context

## 3. 元件替換靜態文字

- [x] 3.1 `src/components/Header.js`：nav 連結文字改為 `t('nav.*')`
- [x] 3.2 `src/components/LandingSection.js`：標題、說明文字改為 `t('landing.*')`
- [x] 3.3 `src/components/ProjectsSummary.js`：section 標題、按鈕文字改為 `t('projects.*')`
- [x] 3.4 `src/components/WorksSummary.js`：section 標題改為 `t('works.*')`
- [x] 3.5 `src/components/SkillSection.js`：section 標題改為 `t('skills.*')`
- [x] 3.6 `src/components/EducationSection.js`：section 標題改為 `t('education.*')`
- [x] 3.7 `src/components/ContactMeSection.js`：標題、按鈕、說明文字改為 `t('contact.*')`
- [x] 3.8 `src/components/FloatingChatWidget.js`：placeholder、按鈕文字改為 `t('chat.*')`
- [x] 3.9 `src/components/JDAnalyzer.js`（若已建立）：說明文字、按鈕改為 `t('jdAnalyzer.*')`

## 4. Header 切換按鈕

- [x] 4.1 `src/components/Header.js`：新增 `ZH | EN` 切換按鈕，呼叫 `setLocale`

## 5. 驗證

- [ ] 5.1 本機啟動，切換至 EN，目測全站靜態文字皆為英文，無中文殘留
- [ ] 5.2 重新整理後確認語言選擇保留
- [ ] 5.3 確認 JSON 資料內容（專案標題等）切換語言後不變

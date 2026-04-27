## Why

作品集目前所有靜態文字（nav、section 標題、按鈕、說明文字）硬寫在元件裡，無法切換語言。對海外招募者或英語系公司，提供英文 UI 選項能大幅降低閱讀阻力。JSON 內容資料不在此次範圍內——只處理靜態 UI 文字，成本低且效果立竿見影。

## What Changes

- 建立 `src/i18n/` 目錄，含 `zh.js`（繁中，預設）與 `en.js`（英文）兩份字串檔
- 建立 `src/hooks/useLocale.js`：管理目前語言狀態，持久化至 localStorage
- 所有元件的靜態文字改為從 i18n 字串檔讀取（nav 連結、section 標題、按鈕文字、placeholder、說明文字等）
- `src/components/Header.js`：新增語言切換按鈕（ZH / EN）

## Capabilities

### New Capabilities
- `language-toggle`: 使用者可在繁中與英文 UI 之間切換，選擇持久化至 localStorage；JSON 內容資料（projects、works、skills 等）不受影響

### Modified Capabilities
<!-- 無現有 spec 需要修改 -->

## Impact

- `src/i18n/`：新增目錄與字串檔
- `src/hooks/useLocale.js`：新增 hook
- 所有含靜態文字的元件：逐一替換字串
- `src/components/Header.js`：新增切換按鈕
- 無 Worker / API / JSON 資料變動
- 無 breaking change

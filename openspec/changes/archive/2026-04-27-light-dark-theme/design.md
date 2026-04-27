## Context

`src/theme.js` 已定義完整的 Chakra UI semantic tokens（`bg.canvas`、`label.primary`、`accent` 等），light/dark 兩套值都齊全。問題只有兩點：

1. `config.useSystemColorMode: false` 強制鎖死 dark mode，token 的 light 值永遠不會生效
2. 少數元件使用 hardcoded hex（`#0b1326`、`#131b2e` 等），解鎖 color mode 後這些地方會視覺破損

## Goals / Non-Goals

**Goals:**
- 解鎖 color mode，預設跟隨系統偏好
- 修復所有 hardcoded hex，改用現有 semantic token
- Header 新增切換按鈕，讓使用者可手動覆蓋系統偏好

**Non-Goals:**
- 新增新的 semantic token（現有的已夠用）
- 修改 light mode 的 token 色值
- 支援第三種主題

## Decisions

**① 跟隨系統 vs 固定預設**

採用 `useSystemColorMode: true`，移除 `initialColorMode: "dark"`。

理由：2026 年多數使用者系統有暗色設定，跟隨系統是最自然的預設行為。Chakra UI 會自動持久化手動切換的選擇到 localStorage，不需要自己處理。

備選方案：維持 `initialColorMode: "dark"` 但允許手動切換 — 放棄，因為 light mode 用戶體驗更差。

**② Hardcoded hex 對應 semantic token**

| Hardcoded | 元件 | 替換為 |
|-----------|------|--------|
| `#0b1326` | `App.js` loading bg | `bg.canvas` |
| `#ff6b6b` | `App.js` error text | `red.400`（Chakra 內建，light/dark 皆可讀） |
| `#908fa0` | `App.js` error/empty text | `label.secondary` |
| `#c0c1ff` | `App.js` spinner | `accent` |
| `#131b2e` | `SkillSection.js` bg | `bg.primary` |

`FloatingChatWidget.js` 的 inline style 需逐一審查後對應。

**③ 切換按鈕位置**

放在 Header 右側，使用 Chakra UI `IconButton` + `useColorMode` hook，圖示：☀️ / 🌙（或 `SunIcon` / `MoonIcon`）。

## Risks / Trade-offs

- **CSS 快取問題** → Chakra UI 的 ColorModeScript 已處理 FOUC（Flash of Unstyled Content），不需額外處理
- **FloatingChatWidget inline style** → 需手動審查，可能有遺漏的 hardcoded color，建議實作後在 light mode 下完整目測一遍

## Open Questions

- 無

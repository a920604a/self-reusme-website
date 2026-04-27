## ADDED Requirements

### Requirement: JD 輸入區
頁面 SHALL 提供 textarea 讓使用者輸入職缺描述，並即時顯示字數（上限 5000）。

#### Scenario: 正常輸入
- **WHEN** 使用者在 textarea 輸入文字
- **THEN** 即時顯示目前字數，格式如 `234 / 5000`

#### Scenario: 超過字數上限
- **WHEN** 輸入文字超過 5000 字元
- **THEN** textarea 不再接受新輸入，或字數顯示以警告色標示

### Requirement: 分析觸發與中止
頁面 SHALL 提供 Analyze 按鈕觸發分析，串流進行中可點擊 Stop 中止。

#### Scenario: 觸發分析
- **WHEN** 使用者點擊 Analyze 按鈕且 textarea 有內容
- **THEN** 開始串流，按鈕切換為 Stop

#### Scenario: 中止分析
- **WHEN** 串流進行中使用者點擊 Stop
- **THEN** 串流立即中止，按鈕恢復為 Analyze

#### Scenario: 空白輸入
- **WHEN** textarea 為空時使用者點擊 Analyze
- **THEN** 按鈕為 disabled 狀態，不發送請求

### Requirement: 串流 Markdown 渲染
分析結果 SHALL 以 Markdown 格式即時串流渲染，使用與現有 chat widget 相同的 ReactMarkdown 元件。

#### Scenario: 串流渲染
- **WHEN** 收到 SSE token
- **THEN** 結果區即時更新，Markdown 語法正確渲染

### Requirement: 相關專案 Highlight
分析完成後，頁面 SHALL 掃描回應中出現的 project ID，自動 highlight 對應專案並 scroll 到可見位置。

#### Scenario: 專案被提及
- **WHEN** 分析報告提及一個已知 project ID
- **THEN** 對應專案卡片加上 `rag-glow` CSS class，頁面 scroll 至該元素

### Requirement: Header 導航入口
Header nav SHALL 包含 "JD Analyzer" 連結，指向 `/jd-analyzer` 路由。

#### Scenario: 導航至頁面
- **WHEN** 使用者點擊 Header 的 "JD Analyzer"
- **THEN** 路由切換至 `/jd-analyzer` 頁面

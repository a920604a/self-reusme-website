---
name: usage-badge-display
description: Prominently display LLM usage counts via badge/chip UI on all AI-powered features
metadata:
  type: project
---

# Usage Badge Display — Design Spec

**Date:** 2026-05-13  
**Status:** Approved

## Problem

LLM usage counts (daily rate limits) are currently either invisible or displayed as tiny secondary text (10px / `xs` font) that users cannot see. All five LLM-powered features are affected. Recruiters and other visitors using these tools have no clear indication of how many uses remain.

## Goal

Add prominent badge/chip UI showing remaining daily uses next to every LLM action button, and as a notification badge on the floating chat FAB.

## Scope

Three files, five features:

| File | Feature | Endpoint | Daily Limit |
|------|---------|----------|-------------|
| `FloatingChatWidget.js` | AI Chat | `/query` | 20 |
| `JDAnalyzer.js` | JD Analyzer | `/analyze-jd` | 10 |
| `WorkspacePage.js` | Resume Health Check | `/health-check` | 10 |
| `WorkspacePage.js` | JD Match | `/match-jd` | 5 |
| `WorkspacePage.js` | Cover Letter / Resume Gen | `/apply-resume` + `/apply-cover` | 5 |

## Design

### Badge States

| State | Condition | Text | Color |
|-------|-----------|------|-------|
| Normal | remaining > 2 | `剩 X 次` | accent blue |
| Warning | remaining <= 2 && > 0 | `剩 X 次` | orange |
| Exhausted | remaining === 0 | `今日已用完` | orange |
| Loading | remaining === null | (hidden) | — |

### 1. FloatingChatWidget — FAB notification badge

A small circular badge positioned `absolute; top: -6px; right: -6px` on the FAB button wrapper (`position: relative`).

- Shows the remaining count as a number (e.g. `18`)
- Normal: accent blue background, white text
- Warning (≤3): orange background
- Exhausted (0): red background, shows `!`
- Hidden when `remaining === null`

### 2. JDAnalyzer — Button row badge

Replace the current `Flex direction="column"` layout around the analyze button with an `HStack` that includes the button and a Chakra `Badge` chip to its right.

```
[ 🪄 Start Analysis ]  [ 剩 8 次 ]
```

- Badge uses Chakra `Badge` component with `borderRadius="full"`, `px={3}`, `py={1}`
- Existing small text below button is removed (replaced by badge)

### 3. WorkspacePage — Per-tool button badges

Each of the three tool sections (HealthCheck, JD Match, Apply) gets the same badge chip pattern next to its primary CTA button. Format is identical to JDAnalyzer.

- HealthCheck: next to the "開始健檢" / start button
- JD Match: next to the "開始比對" button
- Apply: next to the "生成履歷 + Cover Letter" button

## What Does NOT Change

- Backend worker: no changes needed
- `useUsage` hook: no changes needed
- PIN gate / access control: no changes
- i18n strings for badge text: hardcoded Chinese (consistent with existing inline strings)
- WorkspacePage small existing usage text lines: replaced by badge, not duplicated

## Error / Edge Cases

- If `/usage` fetch fails, `remaining` stays `null` → badge hidden, no broken UI
- `applyJob` covers both `/apply-resume` and `/apply-cover`; display single badge using `applyLeft`

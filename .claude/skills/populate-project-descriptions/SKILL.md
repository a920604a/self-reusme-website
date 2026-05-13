---
name: populate-project-descriptions
description: Use when projects.json has entries with empty description, tags, or category fields and a repo URL is present — fetches GitHub README/codebase to derive and write the missing fields.
---

# Populate Project Descriptions from GitHub Repos

## Overview

Fills empty `description`, `tags`, and `category` fields in `public/data/projects.json` by fetching the project's GitHub repo and analyzing its README/codebase.

## When to Use

- A project entry has a `repo` field but empty `description.background / challenge / solution / outcome`
- Tags are `["", ""]` or category is `""`
- User asks to "撰寫其他欄位" or "fill in project fields"

## JSON Field Schema

```json
{
  "category": "Side Project | Work | Misc",
  "tags": ["Tech1", "Tech2", "..."],
  "description": {
    "background": "專案動機與背景（1-2句）",
    "challenge": "核心技術/設計挑戰（1-2句）",
    "solution": "解決方案，列出關鍵技術選型與架構決策（2-4句）",
    "outcome": "最終成果與影響（1-2句）"
  }
}
```

Write descriptions in **Traditional Chinese** to match existing entries. Keep each field concise (1-4 sentences).

## Process

### 1. Identify incomplete projects

```bash
# Find projects with empty description in projects.json
grep -A 6 '"background": ""' public/data/projects.json
```

### 2. Fetch repo content

**Preferred:** `gh repo view <owner/repo> --json name,description,topics,readme`

**Fallback (unauthenticated):**
```bash
# Raw README
curl https://raw.githubusercontent.com/<owner>/<repo>/main/README.md
# Or use WebFetch:
# url: https://raw.githubusercontent.com/<owner>/<repo>/main/README.md
```

Also try `README_zh.md`, `README-zh.md`, or `docs/` if main README is sparse.

### 3. Verify repo URLs

Check that `repo` in projects.json matches the actual GitHub remote:

```bash
git remote -v
```

Fix wrong repo URLs (e.g., copy-paste errors where two entries share the same URL).

### 4. Derive fields

| Field | Source |
|-------|--------|
| `background` | Why the project was built (README intro / motivation) |
| `challenge` | Core technical or design problem |
| `solution` | Tech stack choices + architectural decisions |
| `outcome` | What was achieved, deployed, or validated |
| `tags` | Framework names, services, tools from tech stack section |
| `category` | Work (employment context), Side Project (personal), Misc (ops/tooling) |

### 5. Edit projects.json

Use the Edit tool to replace each empty entry with the populated version.

## Common Mistakes

- **Wrong repo URL**: Two entries sharing the same URL — always verify with `git remote -v` for the current project.
- **Overwriting existing content**: Only touch entries where fields are genuinely empty.
- **English-only tags mixed with Chinese text**: Tags stay in English (tool/framework names); description fields in Traditional Chinese.
- **Over-long solution field**: Keep it to 2-4 sentences; architectural details belong in `core_contributions` if that field exists.

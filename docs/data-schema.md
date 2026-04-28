# Data Schema Reference

All portfolio content is driven by five JSON files in `public/data/`. Both the React UI and the Cloudflare Worker RAG pipeline read from the same source files, so there is no synchronisation gap between what the site shows and what the AI chat knows.

```
public/data/
  profile.json     ← Bio, email, resume URL
  projects.json    ← Portfolio projects array
  works.json       ← Work experience array
  skills.json      ← Skills / tools / frameworks object
  education.json   ← Education history array
```

---

## `profile.json`

Top-level object.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `greeting` | string | ✅ | Hero heading on the landing page |
| `bio1` | string | ✅ | Short role badge shown above the greeting |
| `bio2` | string | ✅ | Longer bio paragraph |
| `resumeDownload` | string | ✅ | URL opened by the "Download Resume" button |
| `email` | string | ✅ | Passed to the Header component for the mailto social link |

---

## `projects.json`

Top-level array of project objects.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | URL-safe slug used in `/projects/:id`. Lowercase, hyphens only. |
| `title` | string | ✅ | Display name |
| `date` | string | ✅ | Date range, e.g. `"2024/01-2024/06"` or `"2024/01-Now"` |
| `category` | string | ✅ | `"Work"`, `"Side Project"`, or `"Misc"`. Only `Work` and `Side Project` appear in the homepage carousel. |
| `tags` | string[] | ✅ | Technology badges |
| `description` | object | ✅ | See sub-fields below |
| `images` | string[] | ✅ | Paths relative to `public/images/portfolio/` |
| `uiImages` | string[] | ❌ | Optional UI screenshot paths (same base) |
| `repo` | string \| object[] | ❌ | GitHub URL or array of `{ "label": "url" }` objects for multi-repo projects |
| `reference` | string | ❌ | External reference link |

### `description` sub-fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `background` | string | ✅ | Project motivation / context |
| `challenge` | string | ✅ | Problem or difficulty faced |
| `solution` | string | ✅ | How it was solved |
| `outcome` | string | ✅ | Results / impact (quantified is better) |
| `core_contributions` | string[] | ❌ | Bullet list of key contributions; supports `**bold**` markdown |

---

## `works.json`

Top-level array of work experience objects.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | URL-safe slug used in `/works/:id` |
| `company` | string | ✅ | Company name |
| `position` | string | ✅ | Job title |
| `years` | string | ✅ | Tenure, e.g. `"2022/05-Now"` or `"2020/01-2022/04"` |
| `description` | string[] | ✅ | Bullet-point responsibilities / achievements |

---

## `skills.json`

Top-level object with four keys.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `skills` | `{ name, level }[]` | ✅ | Programming language proficiency. `level` is a percentage string (`"75%"`) used for the progress bar width. |
| `tools` | string[] | ✅ | Tool names. Known names render with an icon; unknown names fall back to a text badge. |
| `frameworks` | string[] | ✅ | Framework names. Same icon-or-text behaviour as `tools`. |
| `tryLearn` | string[] | ❌ | Technologies currently being explored. Shown as dashed "Exploring" cards. Set to `[]` to hide the section. |

### Icons supported in `skills[].name`

`Python`, `C#`, `C++`, `JavaScript`, `SQL`, `Shell Script`

### Icons supported in `tools[]`

`Git`, `PostgreSQL`, `MySQL`, `Redis`, `MongoDB`, `Docker`, `Ansible`, `Airflow`, `Ubuntu`, `Prometheus`, `Grafana`, `GCP`, `MLflow`, `Unity`

### Icons supported in `frameworks[]`

`React`, `FastAPI`, `PyTorch`, `Flask`

To add a new icon, add an entry to the `Icons` object in `src/components/SkillSection.js`.

---

## `education.json`

Top-level array of education objects.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `school` | string | ✅ | School name, optionally including degree level (e.g. `"Master of ..."`) |
| `major` | string | ✅ | Field of study |
| `duration` | string | ✅ | Year range, e.g. `"2018-2022"` |

---

## Data flow

```
public/data/*.json
        │
        ├─── App.js (axios on mount, parallel requests)
        │         └─→ passed as props to all UI components
        │
        └─── worker/scripts/ingest.js (manual, when data changes)
                  └─→ Cloudflare Vectorize (RAG knowledge base)
```

When you edit any JSON file, run `cd worker && node scripts/ingest.js` to keep the AI chat knowledge base in sync. See [RAG_SYNC_GUIDE.md](./RAG_SYNC_GUIDE.md) for the full workflow.

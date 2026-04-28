# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install (use legacy-peer-deps due to dependency conflicts)
npm install --legacy-peer-deps

# Development
npm start                          # React dev server at localhost:3000
npm run build                      # Production bundle → build/
npm test                           # Run tests
npm run deploy                     # Deploy build/ to GitHub Pages

# Cloudflare Worker (AI backend)
cd worker && npx wrangler dev      # Local Worker at localhost:8787
cd worker && npx wrangler deploy   # Deploy to Cloudflare
cd worker && node scripts/ingest.js  # Re-embed and sync public/data/*.json → Vectorize
```

Environment variable for the Worker URL:
```bash
REACT_APP_WORKER_URL=https://portfolio-rag.<account>.workers.dev
```
Falls back to `http://localhost:8787` in development.

## Architecture

### Frontend (React + Chakra UI)

**Data flow**: `App.js` fetches all JSON files from `public/data/` on mount via `Promise.all`, then passes the merged data object as props down to every section component. No global state manager — all data lives in `App` component state.

**Routing**: Uses `BrowserRouter`. Routes:

| Path | Component | Access |
|------|-----------|--------|
| `/` | Home (all sections) | Public |
| `/projects` | Projects grid | Public |
| `/projects/:id` | Project detail | Public |
| `/works/:id` | Work detail | Public |
| `/ai-lab` | AILabPage | Public |
| `/jd-analyzer` | JDAnalyzer | Public |
| `/ai-lab/workspace` | WorkspacePage | PIN-gated |
| `/workspace` | WorkspacePage | PIN-gated |

**Theme**: `src/theme.js` extends Chakra UI with semantic color tokens (`bg.canvas`, `label.primary`, `accent`, etc.) and Apple HIG-inspired dark palette. Always use semantic tokens or `useColorModeValue` in components, not hardcoded colors. The app is forced dark (`initialColorMode: "dark"`, `useSystemColorMode: false`).

**Content data** lives entirely in `public/data/*.json` — no CMS:
- `profile.json` — greeting, bio, email, resume link
- `projects.json` — portfolio projects (Work / Side Project / Misc categories)
- `works.json` — work experience
- `skills.json` — skills / tools / frameworks / tryLearn arrays
- `education.json` — education history

Project images live in `public/images/<project-id>/`.

**i18n**: `src/context/LocaleContext.js` provides a `useLocaleContext()` hook with `{ locale, setLocale, t }`. Translations live in `src/i18n/en.js` and `src/i18n/zh.js`. Language toggle is in the Header.

**PinGate**: `src/components/PinGate.js` wraps private pages. PIN is hardcoded in the component and stored in `sessionStorage` after first entry.

### Hooks

| Hook | File | Purpose |
|------|------|---------|
| `useStreamingChat` | `hooks/useStreamingChat.js` | Floating chat widget SSE streaming |
| `useJDAnalysis` | `hooks/useJDAnalysis.js` | JD Analyzer page SSE streaming |
| `useJDMatch` | `hooks/useJDMatch.js` | Workspace Step 1 — JD fit analysis |
| `useJobApply` | `hooks/useJobApply.js` | Workspace Step 2 — resume + cover letter generation; parses `<!-- RESUME_START -->` / `<!-- COVER_START -->` markers |
| `useHealthCheck` | `hooks/useHealthCheck.js` | Resume Health Check; first SSE event is `{type:"scores",data:{...}}`, subsequent events are streaming suggestion tokens |
| `useLocale` | `hooks/useLocale.js` | i18n locale state |
| `useSubmit` | `hooks/useSubmit.js` | Contact form submission |

### AI Chat Widget

`FloatingChatWidget` (fixed bottom-right button) → `useStreamingChat` hook → Cloudflare Worker at `REACT_APP_WORKER_URL`.

The hook POSTs `{ query }` to `{WORKER_URL}/query`, reads the SSE stream, and appends tokens to the last assistant message in state. Chat history is persisted to `localStorage` under `chat_history`.

After streaming completes, the widget scans the response for known project IDs and scrolls to / highlights the matching DOM element with a `rag-glow` CSS class.

### Cloudflare Worker (`worker/src/index.js`)

All rate limiting is centralised in `worker/src/rateLimiter.js`:

```js
// To adjust any limit, edit RATE_LIMITS in worker/src/rateLimiter.js
export const RATE_LIMITS = {
  query:       { limit: 20, windowSecs: 60,   prefix: 'rl:' },
  analyzeJD:   { limit: 5,  windowSecs: 3600, prefix: 'rl-jd:' },
  matchJD:     { limit: 10, windowSecs: 3600, prefix: 'rl-private:match:' },
  applyJob:    { limit: 10, windowSecs: 3600, prefix: 'rl-private:apply:' },
  healthCheck: { limit: 50, windowSecs: 3600, prefix: 'rl-private:health:' },
};
```

**Endpoints:**

| Endpoint | Model | Purpose | Rate Limit |
|----------|-------|---------|------------|
| `POST /query` | `llama-3.2-3b-instruct` | Chat RAG (streaming) | 20/IP/min |
| `POST /analyze-jd` | `llama-3.1-8b-instruct` | JD fit analysis for recruiters (streaming) | 5/IP/hr |
| `POST /match-jd` | `llama-3.3-70b-instruct-fp8-fast` | JD fit analysis for candidate self-use (streaming) | 10/IP/hr |
| `POST /apply-job` | `llama-3.3-70b-instruct-fp8-fast` | Resume + Cover Letter generation (streaming) | 10/IP/hr |
| `POST /health-check` | `llama-3.1-8b-instruct` + `llama-3.3-70b` | Resume scoring + streaming suggestions (dual-call SSE) | 50/IP/hr |

**`/query` pipeline:**
1. Embed query via `@cf/baai/bge-m3` (1024 dims)
2. Query Vectorize (`portfolio-index`, topK=5)
3. Assemble prompt → stream `llama-3.2-3b-instruct`
4. Cache response in Cloudflare Cache API (SHA-256 key, TTL 24h)

**`/health-check` SSE protocol** (two-phase):
1. Non-streaming scoring call(s) → sends `data: {"type":"scores","data":{...}}\n\n`
2. Streaming rewrite suggestions → sends regular `data: {"response":"token"}\n\n` events

Mode `base`: 5 dimensions (impact, technical_depth, readability, ownership, career_progression).
Mode `jd`: 5 base + 3 JD dimensions (ats_compatibility, job_relevance, differentiation) + missing_keywords[] + hiring_recommendation.

**Prompt files** live in `worker/src/prompts/`. Each exports `MODEL` (model ID) and an `assemble*Prompt()` function.

CORS is restricted to `https://a920604a.github.io` and `http://localhost:3000`.

**Vectorize dimensions**: The `wrangler.toml` sets `dimensions = 1024` (matching `bge-m3`). If you change the embedding model, recreate the index with matching dimensions.

### Deployment

Frontend auto-deploys via `.github/workflows/deploy.yml` on push to `main`. The Worker and Vectorize data must be deployed/synced manually.

When `public/data/*.json` is updated, run `cd worker && node scripts/ingest.js` to sync the AI knowledge base.

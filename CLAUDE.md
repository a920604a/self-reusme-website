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

- **Routing**: Uses `BrowserRouter`. Routes: `/` (home with all sections), `/projects` (grid), `/projects/:id` (detail), `/works/:id` (detail).

**Theme**: `src/theme.js` extends Chakra UI with semantic color tokens (`bg.canvas`, `label.primary`, `accent`, etc.) and Apple HIG-inspired dark/light palette. Always use semantic tokens or `useColorModeValue` in components, not hardcoded colors. The app is forced dark (`initialColorMode: "dark"`, `useSystemColorMode: false`).

**Content data** lives entirely in `public/data/*.json` — no CMS:
- `profile.json` — greeting, bio, email, resume link
- `projects.json` — portfolio projects (Work / Side Project / Misc categories)
- `works.json` — work experience
- `skills.json` — skills / tools / frameworks / tryLearn arrays
- `education.json` — education history

Project images live in `public/images/<project-id>/`.

### AI Chat Widget

`FloatingChatWidget` (fixed bottom-right button) → `useStreamingChat` hook → Cloudflare Worker at `REACT_APP_WORKER_URL`.

The hook POSTs `{ query }` to `{WORKER_URL}/query`, reads the SSE stream, and appends tokens to the last assistant message in state. Chat history is persisted to `localStorage` under `chat_history`.

A feature: after streaming completes, the widget scans the response for known project IDs and scrolls to / highlights the matching DOM element with a `rag-glow` CSS class.

### Cloudflare Worker (`worker/src/index.js`)

Streaming RAG pipeline:
1. Embed query via `@cf/baai/bge-m3`
2. Query Vectorize index (`portfolio-index`, 1024 dims, cosine)
3. Assemble prompt with top-5 retrieved docs
4. Stream `@cf/meta/llama-3-8b-instruct` response as SSE
5. Cache responses in Cloudflare Cache API (keyed by SHA-256 of query, TTL 24h)
6. Rate limit: 20 req/IP/min via KV (`RATE_LIMIT_KV`)

CORS is restricted to `https://a920604a.github.io` and `http://localhost:3000`.

**Vectorize dimensions**: The `wrangler.toml` sets `dimensions = 1024` (matching `bge-m3`). If you change the embedding model, recreate the index with matching dimensions.

### Deployment

Frontend auto-deploys via `.github/workflows/deploy.yml` on push to `main`. The Worker and Vectorize data must be deployed/synced manually.

When `public/data/*.json` is updated, run `cd worker && node scripts/ingest.js` to sync the AI knowledge base.

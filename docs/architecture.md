# Architecture

## System Overview

This portfolio website consists of two independently deployed components:

1. **React Frontend** — static site hosted on GitHub Pages
2. **Cloudflare Worker** — edge API handling RAG + LLM streaming

```
┌──────────────────────────────────────────────────────────┐
│  Browser                                                 │
│                                                          │
│  React App (GitHub Pages)                                │
│  ├── Portfolio UI (projects, works, skills)              │
│  └── FloatingChatWidget                                  │
│       └── useStreamingChat hook                          │
│            └─── fetch POST /query ──────────────────────►│
└─────────────────────────────────────────────────────────┘
                                                           │
                                              ReadableStream (SSE)
                                                           │
                                                           ▼
┌──────────────────────────────────────────────────────────┐
│  Cloudflare Edge                                         │
│                                                          │
│  Worker: portfolio-rag                                   │
│  ├── CORS + OPTIONS handler                              │
│  ├── Cache check (caches.default, key = sha256(query))   │
│  ├── Embed query   → Workers AI (@cf/baai/bge-base-en)   │
│  ├── Vector search → Vectorize (topK=5)                  │
│  ├── Assemble RAG prompt                                 │
│  ├── Stream LLM    → Workers AI (@cf/meta/llama-3-8b)    │
│  └── Return ReadableStream (SSE)                         │
│                                                          │
│  Bindings:                                               │
│  ├── AI       → Cloudflare Workers AI                    │
│  └── VECTORIZE → Cloudflare Vectorize (portfolio-index)  │
└──────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

```
src/
├── App.js                      # Root: loads JSON data, sets up Router
├── theme.js                    # Chakra UI theme tokens
├── index.css                   # CSS variables (colors, fonts)
│
├── components/
│   ├── FloatingChatWidget.js   # AI chat UI (floating button + panel)
│   ├── Header.js               # Navigation bar
│   ├── LandingSection.js       # Hero section
│   ├── ProjectsCarousel.js     # Recommended projects slider
│   ├── ProjectsPage.js         # All projects grid
│   ├── ProjectDetails.js       # Single project detail page
│   ├── WorksSummary.js         # Work experience section
│   ├── WorkDetails.js          # Single work detail page
│   ├── SkillSection.js         # Skills / tools / frameworks
│   ├── EducationSection.js     # Education timeline
│   ├── ContactMeSection.js     # Contact form
│   └── Footer.js               # Footer with social links
│
├── hooks/
│   ├── useStreamingChat.js     # SSE stream reader + chat state
│   └── useSubmit.js            # Contact form submit
│
└── context/
    └── alertContext.js         # Global toast/alert state
```

### Data Flow (Frontend)

```
App.js
  └── componentDidMount → axios.get(public/data/*.json)
        ├── profile.json    → greeting, bio, resume link
        ├── projects.json   → projects[], recommendedProjects[]
        ├── works.json      → works[]
        ├── skills.json     → skills, tools, frameworks, tryLearn
        └── education.json  → educationData[]
              └── passed as props to child components
```

### Routing

Uses `HashRouter` (`/#/`-based) for GitHub Pages compatibility — no server-side routing config required.

| Path | Component |
|------|-----------|
| `/` | Main landing page |
| `/projects` | All projects grid |
| `/projects/:id` | Project detail |
| `/works/:id` | Work experience detail |

---

## Backend Architecture (Cloudflare Worker)

```
worker/
├── src/
│   └── index.js        # Worker entry point
├── scripts/
│   └── ingest.js       # One-time data indexing script
├── wrangler.toml       # Cloudflare Worker config
└── package.json
```

### RAG Pipeline

```
User query
    │
    ▼
[1] Embed query
    env.AI.run("@cf/baai/bge-base-en-v1.5", { text: query })
    → float32[768]
    │
    ▼
[2] Vector search
    env.VECTORIZE.query(vector, { topK: 5, returnMetadata: "all" })
    → top 5 matching chunks from portfolio data
    │
    ▼
[3] Assemble prompt
    system prompt + retrieved context + user query
    │
    ▼
[4] Stream LLM
    env.AI.run("@cf/meta/llama-3-8b-instruct", { messages, stream: true })
    → ReadableStream (SSE format)
    │
    ▼
[5] Return to client
    Response(stream, { "Content-Type": "text/event-stream" })
```

### Caching Strategy

- **Key**: `sha256(query)` via `Web Crypto API`
- **Store**: `caches.default` (Cloudflare edge cache)
- **Hit**: return cached SSE stream immediately
- **Miss**: stream LLM → tee stream → cache in background (`waitUntil`)
- Does not block or delay the streaming response path

### SSE Format

Each chunk from the LLM stream:
```
data: {"response":"Hello"}\n\n
data: {"response":" world"}\n\n
data: [DONE]\n\n
```

Frontend `useStreamingChat` parses each `data:` line, extracts `response`, and appends token-by-token to the UI.

---

## Data / Vectorize

```
public/data/
  ├── projects.json   → project-{id} vectors
  ├── works.json      → work-{id} vectors
  ├── skills.json     → skills vector
  └── profile.json    → profile vector
          │
          ▼ (ingest.js — manual, run once per data update)
  Cloudflare Vectorize
  index: portfolio-index
  dimensions: 768 (bge-base-en-v1.5)
  metric: cosine
```

Each vector stores metadata `{ text, type }` so the Worker can extract context text at query time.

See [RAG_SYNC_GUIDE.md](./RAG_SYNC_GUIDE.md) for how to re-sync after data updates.

---

## Deployment

### Frontend (GitHub Pages)

- **Trigger**: push to `main` → GitHub Actions (`deploy.yml`)
- **Build**: `npm run build` with `REACT_APP_WORKER_URL` injected from GitHub Secrets
- **Publish**: `peaceiris/actions-gh-pages` → `gh-pages` branch
- **URL**: `https://a920604a.github.io/self-reusme-website`

### Worker (Cloudflare)

- **Trigger**: manual — `npx wrangler deploy` (from `worker/`)
- **URL**: `https://portfolio-rag.<account>.workers.dev`

### Vectorize (one-time + on data update)

- **Trigger**: manual — `node worker/scripts/ingest.js`
- **Requires**: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

---

## Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `REACT_APP_WORKER_URL` | GitHub Secret + `.env` | Worker endpoint baked into React build |
| `CLOUDFLARE_API_TOKEN` | Local shell only | ingest.js: embed + upsert to Vectorize |
| `CLOUDFLARE_ACCOUNT_ID` | Local shell only | ingest.js: API calls |

---

## Key Design Decisions

**HashRouter over BrowserRouter** — GitHub Pages serves only one HTML file; hash-based routing avoids 404s on direct URL access.

**Cloudflare Workers over a traditional server** — Zero cold-start latency, globally distributed, free tier covers personal portfolio usage. Vectorize and Workers AI are co-located, minimizing embed + search latency.

**SSE (Server-Sent Events) over WebSocket** — One-way streaming from server to client is sufficient for chat responses; SSE is simpler, HTTP-native, and works through standard `fetch()`.

**Stream tee for caching** — The LLM stream is tee'd so the response reaches the client immediately while the Worker caches the full response in the background without adding latency.

**Data-driven UI** — All portfolio content lives in `public/data/*.json`, requiring no code changes for content updates. The same JSON files are the source of truth for both the UI and the RAG knowledge base.

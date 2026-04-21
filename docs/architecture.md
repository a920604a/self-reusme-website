# Architecture

## System Overview

Two independently deployed components: a React static site on GitHub Pages and a Cloudflare Worker handling RAG + LLM streaming at the edge.

```mermaid
graph TB
    subgraph Browser["Browser"]
        UI["React App\n(GitHub Pages)"]
        Widget["FloatingChatWidget"]
        Hook["useStreamingChat hook"]
        UI --> Widget --> Hook
    end

    subgraph CF["Cloudflare Edge"]
        Worker["Worker: portfolio-rag\nPOST /query"]
        Cache["caches.default\nkey = sha256(query)"]
        AI["Workers AI"]
        VZ["Vectorize\nportfolio-index"]

        Worker -- "cache check" --> Cache
        Worker -- "embed (@cf/baai/bge-base-en-v1.5)" --> AI
        Worker -- "query topK=5" --> VZ
        Worker -- "stream (@cf/meta/llama-3-8b-instruct)" --> AI
    end

    Hook -- "POST /query" --> Worker
    Worker -- "ReadableStream (SSE)" --> Hook
```

---

## Frontend Architecture

### Component Tree

```mermaid
graph TD
    App["App.js\nloads data, sets up Router"]

    App --> Router["HashRouter"]
    Router --> Header
    Router --> FloatingChatWidget
    Router --> Routes

    Routes --> Home["/ (Home)"]
    Routes --> Projects["/projects"]
    Routes --> ProjectDetail["/projects/:id"]
    Routes --> WorkDetail["/works/:id"]

    Home --> LandingSection
    Home --> ProjectsCarousel
    Home --> WorksSummary
    Home --> SkillSection
    Home --> EducationSection
    Home --> ContactMeSection
    Home --> Footer

    FloatingChatWidget --> useStreamingChat["useStreamingChat (hook)"]
    ContactMeSection --> useSubmit["useSubmit (hook)"]
```

### Data Flow

```mermaid
sequenceDiagram
    participant App
    participant JSON as public/data/*.json
    participant Components

    App->>JSON: axios.get (on mount, parallel)
    JSON-->>App: profile, projects, works, skills, education
    App->>App: normalize & merge state
    App->>Components: pass as props
```

### Routing

Uses `HashRouter` (`/#/`-based) — works on GitHub Pages without server-side config.

| Path | Component |
|------|-----------|
| `/` | Main landing page |
| `/projects` | All projects grid |
| `/projects/:id` | Project detail |
| `/works/:id` | Work experience detail |

---

## Backend Architecture (Cloudflare Worker)

### RAG Pipeline

```mermaid
flowchart TD
    Q["User Query"] --> CORS["CORS + OPTIONS check"]
    CORS --> CACHE{"Cache hit?\nsha256(query)"}

    CACHE -- "HIT" --> CACHED["Return cached SSE stream"]

    CACHE -- "MISS" --> EMBED["1. Embed query\n@cf/baai/bge-base-en-v1.5\n→ float32[768]"]
    EMBED --> SEARCH["2. Vector search\nVectorize.query(topK=5)\n→ top 5 chunks"]
    SEARCH --> PROMPT["3. Assemble prompt\nsystem + context + query"]
    PROMPT --> LLM["4. Stream LLM\n@cf/meta/llama-3-8b-instruct\nstream: true"]
    LLM --> TEE["5. Tee stream"]
    TEE --> CLIENT["Return ReadableStream\nto client (SSE)"]
    TEE --> STORE["Cache in background\nwaitUntil()"]
```

### Streaming Protocol

```mermaid
sequenceDiagram
    participant FE as Frontend (useStreamingChat)
    participant W as Worker
    participant LLM as Workers AI (LLM)

    FE->>W: POST /query { query: "..." }
    W->>LLM: run(llama-3-8b, { stream: true })
    loop token-by-token
        LLM-->>W: data: {"response":"token"}\n\n
        W-->>FE: data: {"response":"token"}\n\n
        FE->>FE: append token to message state
    end
    LLM-->>W: data: [DONE]
    W-->>FE: data: [DONE]
    FE->>FE: isStreaming = false
```

---

## Data & Vectorize

### Ingest Pipeline (one-time / on data update)

```mermaid
flowchart LR
    subgraph Source["public/data/"]
        P["profile.json"]
        PR["projects.json"]
        W["works.json"]
        S["skills.json"]
    end

    subgraph Script["worker/scripts/ingest.js"]
        CHUNK["Build text chunks\n(title + tags + description)"]
        EMBED["Embed via REST API\n@cf/baai/bge-base-en-v1.5"]
        UPSERT["Upsert NDJSON\nto Vectorize"]
    end

    subgraph VZ["Cloudflare Vectorize"]
        IDX["portfolio-index\ndimensions: 768\nmetric: cosine"]
    end

    P & PR & W & S --> CHUNK --> EMBED --> UPSERT --> IDX
```

### Vector ID Convention

| Source | Vector ID |
|--------|-----------|
| `projects.json` item | `project-{id}` |
| `works.json` item | `work-{id}` |
| `skills.json` | `skills` |
| `profile.json` | `profile` |

Each vector stores metadata `{ text, type }` for context extraction at query time.

See [RAG_SYNC_GUIDE.md](./RAG_SYNC_GUIDE.md) for the full sync workflow.

---

## Deployment

```mermaid
flowchart LR
    subgraph Dev["Local"]
        CODE["Code changes"]
        INGEST["node scripts/ingest.js\n(on data update)"]
        WDEPLOY["wrangler deploy\n(on worker change)"]
    end

    subgraph CI["GitHub Actions"]
        PUSH["push to main"]
        BUILD["npm run build\n+ REACT_APP_WORKER_URL secret"]
        GHPAGES["gh-pages branch"]
    end

    subgraph Prod["Production"]
        GHP["GitHub Pages\na920604a.github.io/..."]
        CFW["Cloudflare Worker\nportfolio-rag.*.workers.dev"]
        VZI["Cloudflare Vectorize\nportfolio-index"]
    end

    CODE --> PUSH --> BUILD --> GHPAGES --> GHP
    WDEPLOY --> CFW
    INGEST --> VZI
```

### Environment Variables

| Variable | Used By | Purpose |
|----------|---------|---------|
| `REACT_APP_WORKER_URL` | GitHub Secret + `.env` | Worker URL baked into React build |
| `CLOUDFLARE_API_TOKEN` | Local shell | ingest.js — embed + upsert to Vectorize |
| `CLOUDFLARE_ACCOUNT_ID` | Local shell | ingest.js — REST API calls |

---

## Key Design Decisions

**HashRouter over BrowserRouter** — GitHub Pages serves a single HTML file; hash-based routing avoids 404s on direct URL access without server config.

**Cloudflare Workers over a traditional server** — Zero cold-start latency, globally distributed edge execution, co-located with Vectorize and Workers AI to minimize embed + search roundtrip.

**SSE over WebSocket** — One-way LLM token streaming only needs server→client push; SSE is HTTP-native and works with standard `fetch()` + `ReadableStream` without extra protocol overhead.

**Stream tee for caching** — The LLM stream is tee'd so the client receives tokens immediately while the full response is stored in `caches.default` in the background — no added latency on cache miss.

**`public/data/*.json` as single source of truth** — The same JSON files drive both the portfolio UI and the RAG knowledge base, eliminating any content duplication or sync drift between UI and AI.

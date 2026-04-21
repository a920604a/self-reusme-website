# Self-Resume Website

A personal portfolio and resume website built with React and Chakra UI, featuring an AI-powered chat assistant backed by a streaming RAG pipeline on Cloudflare.

**Live Demo**: [a920604a.github.io/self-reusme-website](https://a920604a.github.io/self-reusme-website)

---

## Features

- Dark-themed responsive UI (mobile, tablet, desktop)
- Projects showcase with image gallery and category filtering
- Work experience timeline
- Skills section (languages, tools, frameworks)
- Education section
- Contact form
- Smooth scroll animations (Framer Motion)
- Client-side routing with GitHub Pages compatibility (HashRouter)
- **AI Chat Widget** — floating chat assistant with real-time streaming RAG responses
- Deploy to GitHub Pages with a single command

---

## Tech Stack

| Category    | Libraries / Tools                                      |
|-------------|--------------------------------------------------------|
| Framework   | React 18, React Router v6                             |
| UI          | Chakra UI v2, Emotion                                 |
| Animation   | Framer Motion                                         |
| Icons       | FontAwesome, React Icons                              |
| Carousel    | React Slick                                           |
| Form        | Formik + Yup                                          |
| HTTP        | Axios                                                 |
| Markdown    | react-markdown, remark-gfm, rehype-highlight          |
| Deployment  | GitHub Pages (`gh-pages`)                             |
| AI Backend  | Cloudflare Workers + Vectorize + Workers AI           |
| LLM         | `@cf/meta/llama-3-8b-instruct` (streaming)            |
| Embeddings  | `@cf/baai/bge-base-en-v1.5`                           |

---

## Quick Start

```bash
git clone https://github.com/a920604a/self-reusme-website.git
cd self-reusme-website
npm install --legacy-peer-deps
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> The AI chat widget falls back to `http://localhost:8787` in development. Run `cd worker && npx wrangler dev` to start a local Worker.

---

## Project Structure

```
├── public/
│   ├── data/
│   │   ├── profile.json     # Bio, greeting, resume link
│   │   ├── projects.json    # Portfolio projects
│   │   ├── works.json       # Work experience
│   │   ├── skills.json      # Skills, tools, frameworks
│   │   └── education.json   # Education history
│   ├── images/              # Project images, organized by project ID
│   └── index.html           # HTML entry point
├── src/
│   ├── App.js               # Root component, fetches data on mount
│   ├── theme.js             # Chakra UI theme (colors, fonts)
│   ├── index.css            # CSS variables
│   ├── components/          # UI components (including FloatingChatWidget)
│   ├── hooks/               # useStreamingChat, useSubmit
│   └── context/             # Alert/toast context
├── worker/
│   ├── src/index.js         # Cloudflare Worker — RAG pipeline + streaming
│   ├── scripts/ingest.js    # One-time Vectorize indexing script
│   └── wrangler.toml        # Cloudflare Worker config
├── docs/
│   ├── architecture.md      # Full system architecture
│   └── RAG_SYNC_GUIDE.md   # How to sync data updates to Vectorize
├── .github/workflows/
│   └── deploy.yml           # CI/CD: build + deploy to GitHub Pages
└── package.json
```

---

## How to Fork & Use This Template

### Step 1 — Fork & Clone

```bash
git clone https://github.com/<your-username>/self-reusme-website.git
cd self-reusme-website
npm install --legacy-peer-deps
```

### Step 2 — Edit Your Content

All portfolio content lives in `public/data/`. Edit these JSON files:

| File | Content |
|------|---------|
| `profile.json` | Greeting, bio, resume URL |
| `projects.json` | Portfolio projects |
| `works.json` | Work experience |
| `skills.json` | Skills, tools, frameworks, learning |
| `education.json` | Education history |

#### `projects[]` fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique slug (used in URL and AI search) |
| `title` | string | Project title |
| `date` | string | Date range, e.g. `"2024/01-2024/06"` |
| `category` | string | `"Work"`, `"Side Project"`, or `"Misc"` |
| `tags` | string[] | Technology tags shown as badges |
| `description.background` | string | Project background / motivation |
| `description.challenge` | string | Problem or challenge faced |
| `description.solution` | string | How it was solved |
| `description.core_contributions` | string[] | (optional) Key contribution bullets |
| `description.outcome` | string | Results / impact |
| `images` | string[] | Diagram paths relative to `public/images/` |
| `uiImages` | string[] | (optional) UI screenshot paths |
| `repo` | string | (optional) GitHub repository URL |
| `reference` | string | (optional) External reference link |

#### `works[]` fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique slug |
| `company` | string | Company name |
| `position` | string | Job title |
| `years` | string | Date range |
| `description` | string[] | Bullet points describing your role |

### Step 3 — Replace Images

Project images live in `public/images/<project-id>/`:

- `flow.png` — workflow or system diagram
- `arch.png` — architecture diagram
- `ui.png` — (optional) UI screenshots

### Step 4 — Update Social Links

Edit the `socials` array in `src/components/Header.js`:

```js
const socials = [
  { icon: faEnvelope, url: "mailto:your@email.com" },
  { icon: faGithub,   url: "https://github.com/your-username" },
  { icon: faLinkedin, url: "https://www.linkedin.com/in/..." },
];
```

### Step 5 — Update `package.json`

```json
"homepage": "https://<your-username>.github.io/<your-repo-name>"
```

### Step 6 — Deploy Frontend

```bash
npm run build && npm run deploy
```

---

## AI Chat Widget Setup

The floating chat widget uses a **Streaming RAG pipeline** on Cloudflare. Follow these steps to set it up.

### Prerequisites

- Cloudflare account with Workers AI and Vectorize enabled
- `wrangler` CLI (`npm install -g wrangler && wrangler login`)

### Step 1 — Create Vectorize index

```bash
cd worker
npm install
npx wrangler vectorize create portfolio-index --dimensions=768 --metric=cosine
```

### Step 2 — Ingest data into Vectorize

```bash
export CLOUDFLARE_API_TOKEN=<your token>
export CLOUDFLARE_ACCOUNT_ID=<your account id>
node scripts/ingest.js
```

This reads `public/data/*.json`, embeds each item, and upserts vectors into Cloudflare Vectorize.

### Step 3 — Deploy the Worker

```bash
npx wrangler deploy
# Output: https://portfolio-rag.<account>.workers.dev
```

### Step 4 — Configure the Worker URL

```bash
# .env (local development)
echo "REACT_APP_WORKER_URL=https://portfolio-rag.<account>.workers.dev" > ../.env
```

For GitHub Actions CI/CD, add `REACT_APP_WORKER_URL` to your repository's **Settings → Secrets → Actions**.

### Updating Data

When you edit `public/data/*.json`, re-run the ingest script to sync the AI knowledge base:

```bash
cd worker && node scripts/ingest.js
```

See [docs/RAG_SYNC_GUIDE.md](docs/RAG_SYNC_GUIDE.md) for the full sync workflow and troubleshooting.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server at port 3000 |
| `npm run build` | Build production bundle to `build/` |
| `npm test` | Run tests |
| `npm run deploy` | Deploy `build/` to GitHub Pages |
| `cd worker && npx wrangler dev` | Start Worker locally at port 8787 |
| `cd worker && npx wrangler deploy` | Deploy Worker to Cloudflare |
| `cd worker && node scripts/ingest.js` | Sync data to Vectorize |

---

## Deployment

| Component | Platform | Trigger |
|-----------|----------|---------|
| Frontend | GitHub Pages | push to `main` (GitHub Actions) |
| Worker | Cloudflare Workers | manual `wrangler deploy` |
| Vectorize data | Cloudflare Vectorize | manual `node scripts/ingest.js` |

See [docs/architecture.md](docs/architecture.md) for the full system architecture.

---

## License

This project is open source. Feel free to fork and use it for your own portfolio.

# Self-Resume Website

A personal portfolio and resume website built with React and Chakra UI. Fully customizable via a single JSON data file — no code changes needed for most content updates.

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
- Deploy to GitHub Pages with a single command

---

## Tech Stack

| Category    | Libraries / Tools                      |
|-------------|----------------------------------------|
| Framework   | React 18, React Router v6             |
| UI          | Chakra UI v2, Emotion                 |
| Animation   | Framer Motion                          |
| Icons       | FontAwesome, React Icons               |
| Carousel    | React Slick                            |
| Form        | Formik + Yup                           |
| HTTP        | Axios                                  |
| Deployment  | GitHub Pages (`gh-pages`)             |

---

## Quick Start

```bash
git clone https://github.com/a920604a/self-reusme-website.git
cd self-reusme-website
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How to Fork & Use This Template

### Step 1 — Fork & Clone

Click **Fork** on GitHub, then clone your fork:

```bash
git clone https://github.com/<your-username>/self-reusme-website.git
cd self-reusme-website
npm install
```

---

### Step 2 — Edit Your Content (`public/propData.json`)

All portfolio content lives in **`public/propData.json`**. This is the only file you need to edit for most customizations.

#### Top-level fields

| Field            | Description                                    |
|------------------|------------------------------------------------|
| `greeting`       | Hero section greeting text                     |
| `bio1`           | Subtitle / job title                           |
| `bio2`           | Short bio paragraph                            |
| `resumeDownload` | URL to your online resume / CV                 |

#### `projects[]` — Portfolio projects

| Field                            | Type     | Description                                            |
|----------------------------------|----------|--------------------------------------------------------|
| `id`                             | string   | Unique slug (used in URL, e.g. `/project/my-project`) |
| `title`                          | string   | Project title                                          |
| `date`                           | string   | Date range, e.g. `"2024/01-2024/06"`                  |
| `category`                       | string   | `"Work"`, `"Side Project"`, or `"Misc"`               |
| `tags`                           | string[] | Technology tags shown as badges                        |
| `description.background`         | string   | Project background / motivation                        |
| `description.challenge`          | string   | Problem or challenge faced                             |
| `description.solution`           | string   | How it was solved                                      |
| `description.core_contributions` | string[] | (optional) Bullet points for key contributions         |
| `description.outcome`            | string   | Results / impact                                       |
| `images`                         | string[] | Diagram paths relative to `public/images/`             |
| `uiImages`                       | string[] | (optional) UI screenshot paths                         |
| `repo`                           | string   | (optional) GitHub repository URL                       |
| `reference`                      | string   | (optional) External reference link                     |

#### `works[]` — Work experience

| Field         | Type     | Description                           |
|---------------|----------|---------------------------------------|
| `id`          | string   | Unique slug                           |
| `company`     | string   | Company name                          |
| `position`    | string   | Job title                             |
| `years`       | string   | Date range, e.g. `"2022/05-2024/05"` |
| `description` | string[] | Bullet points describing your role    |

#### Other top-level fields

| Field           | Type     | Description                                 |
|-----------------|----------|---------------------------------------------|
| `skills`        | object[] | `{ name, level }` — programming languages   |
| `tools`         | string[] | Tools list (Docker, Ansible, etc.)          |
| `frameworks`    | string[] | Frameworks list                             |
| `tryLearn`      | string[] | Skills currently learning                   |
| `educationData` | object[] | `{ school, degree, major, years }`          |

---

### Step 3 — Replace Images

Project images live in `public/images/<project-id>/`. For each project, add:

- `flow.png` — workflow or system diagram
- `arch.png` — architecture diagram
- `ui.png` — (optional) UI screenshots

Image paths in `propData.json` are relative to `public/images/`, for example:

```json
"images": ["my-project/flow.png", "my-project/arch.png"]
```

---

### Step 4 — Update Social Links

Edit the `socials` array in **`src/components/Header.js`** (lines 13–18):

```js
const socials = [
  { icon: faEnvelope, url: "mailto:your@email.com",             label: "Email" },
  { icon: faGithub,   url: "https://github.com/your-username",  label: "GitHub" },
  { icon: faLinkedin, url: "https://www.linkedin.com/in/...",    label: "LinkedIn" },
  { icon: faMedium,   url: "https://medium.com/@your-username",  label: "Medium" },
];
```

---

### Step 5 — Customize the Theme (optional)

Edit **`src/theme.js`** to change colors and fonts:

- Background: `#0b1326` (dark navy)
- Accent: `#c0c1ff` (light purple)
- Heading font: Manrope
- Body font: Inter
- Code font: JetBrains Mono

Font imports are in **`public/index.html`**.

---

### Step 6 — Update `package.json`

Set the `homepage` field to your GitHub Pages URL:

```json
"homepage": "https://<your-username>.github.io/<your-repo-name>"
```

---

### Step 7 — Deploy

```bash
npm run build
npm run deploy
```

This publishes `build/` to the `gh-pages` branch. In your repository **Settings → Pages**, set the source to the `gh-pages` branch.

---

## Deployment Options

| Platform        | Method                                                        |
|-----------------|---------------------------------------------------------------|
| GitHub Pages    | `npm run deploy` (built-in via `gh-pages`)                   |
| Netlify         | Drag & drop `build/` folder, or connect your repo            |
| Vercel          | Connect repo; set output directory to `build`                |
| Any static host | Upload contents of `build/` after `npm run build`            |

> **Note**: The app uses `HashRouter` (`/#/`-based URLs), which works on all static hosts without any server-side routing configuration.

---

## Project Structure

```
├── public/
│   ├── propData.json       # All portfolio content — edit this!
│   ├── images/             # Project images, organized by project ID
│   └── index.html          # HTML entry point (title, meta, font imports)
├── src/
│   ├── App.js              # Root component, fetches propData.json on mount
│   ├── theme.js            # Chakra UI theme (colors, fonts, global styles)
│   ├── components/         # All UI components
│   ├── context/            # Alert/toast notification context
│   └── hooks/              # Custom hooks
└── package.json            # Update `homepage` before deploying
```

---

## Available Scripts

| Script            | Description                              |
|-------------------|------------------------------------------|
| `npm start`       | Start development server at port 3000    |
| `npm run build`   | Build production bundle to `build/`      |
| `npm test`        | Run tests                                |
| `npm run deploy`  | Deploy `build/` to GitHub Pages          |

---

## License

This project is open source. Feel free to fork and use it for your own portfolio.

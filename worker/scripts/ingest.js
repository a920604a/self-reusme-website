/**
 * One-time ingest script: reads public/data JSON files, embeds them,
 * and upserts vectors into Cloudflare Vectorize.
 *
 * Prerequisites:
 *   1. Create Vectorize index:
 *      npx wrangler vectorize create portfolio-index --dimensions=768 --metric=cosine
 *   2. Set env vars:
 *      export CLOUDFLARE_API_TOKEN=...
 *      export CLOUDFLARE_ACCOUNT_ID=...
 *   3. Run from repo root:
 *      node worker/scripts/ingest.js
 */

const fs = require('fs');
const path = require('path');

const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const INDEX_NAME = 'portfolio-index';
const EMBED_MODEL = '@cf/baai/bge-m3';

if (!API_TOKEN || !ACCOUNT_ID) {
  console.error('Missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID');
  process.exit(1);
}

const DATA_DIR = path.resolve(__dirname, '../../public/data');

function readJSON(filename) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), 'utf-8'));
}

function descriptionToText(desc) {
  if (typeof desc === 'string') return desc;
  if (!desc || typeof desc !== 'object') return '';
  const parts = [];
  if (desc.background) parts.push(desc.background);
  if (desc.challenge) parts.push(desc.challenge);
  if (desc.solution) parts.push(desc.solution);
  if (desc.outcome) parts.push(desc.outcome);
  if (desc.core_contributions) {
    parts.push(...desc.core_contributions.map((c) => c.replace(/\*\*/g, '')));
  }
  return parts.join(' ');
}

function buildChunks() {
  const chunks = [];

  // Profile
  const profile = readJSON('profile.json');
  chunks.push({
    id: 'profile',
    type: 'profile',
    text: `Name: Yu-An Chen. Role: ${profile.bio1}. Bio: ${profile.bio2}`,
  });

  // Projects
  const projects = readJSON('projects.json');
  for (const p of projects) {
    const tags = Array.isArray(p.tags) ? p.tags.join(', ') : '';
    const desc = descriptionToText(p.description);
    chunks.push({
      id: `project-${p.id}`,
      type: 'project',
      text: `Project: ${p.title}. Date: ${p.date || ''}. Category: ${p.category || ''}. Tags: ${tags}. ${desc}`,
    });
  }

  // Works
  const works = readJSON('works.json');
  for (const w of works) {
    const desc = Array.isArray(w.description) ? w.description.join(' ') : (w.description || '');
    chunks.push({
      id: `work-${w.id}`,
      type: 'work',
      text: `Work: ${w.position} at ${w.company}. Period: ${w.years || ''}. ${desc}`,
    });
  }

  // Skills
  const skills = readJSON('skills.json');
  const skillNames = (skills.skills || []).map((s) => s.name).join(', ');
  const tools = (skills.tools || []).join(', ');
  const frameworks = (skills.frameworks || []).join(', ');
  const tryLearn = (skills.tryLearn || []).join(', ');
  chunks.push({
    id: 'skills',
    type: 'skills',
    text: `Programming skills: ${skillNames}. Tools: ${tools}. Frameworks: ${frameworks}. Currently learning: ${tryLearn}.`,
  });

  return chunks;
}

async function embedText(text) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${EMBED_MODEL}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    }
  );
  const json = await res.json();
  if (!json.success) throw new Error(`Embed failed: ${JSON.stringify(json.errors)}`);
  return json.result.data[0];
}

async function upsertVectors(vectors) {
  // Vectorize upsert uses NDJSON format
  const ndjson = vectors
    .map((v) => JSON.stringify({ id: v.id, values: v.values, metadata: { text: v.text, type: v.type } }))
    .join('\n');

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/vectorize/v2/indexes/${INDEX_NAME}/upsert`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/x-ndjson',
      },
      body: ndjson,
    }
  );
  const json = await res.json();
  if (!json.success) throw new Error(`Upsert failed: ${JSON.stringify(json.errors)}`);
  return json.result;
}

async function main() {
  console.log('Building chunks from public/data...');
  const chunks = buildChunks();
  console.log(`Generated ${chunks.length} chunks`);

  const BATCH_SIZE = 10;
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    console.log(`Embedding batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)}...`);

    const vectors = [];
    for (const chunk of batch) {
      const values = await embedText(chunk.text);
      vectors.push({ id: chunk.id, values, text: chunk.text, type: chunk.type });
    }

    console.log(`  Upserting ${vectors.length} vectors...`);
    const result = await upsertVectors(vectors);
    console.log(`  Upserted:`, result);
  }

  console.log('\nIngest complete! Vectors are in Cloudflare Vectorize.');
}

main().catch((err) => {
  console.error('Ingest failed:', err);
  process.exit(1);
});

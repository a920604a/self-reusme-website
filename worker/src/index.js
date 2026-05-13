import { assembleQueryPrompt, MODEL as QUERY_MODEL } from './prompts/query.js';
import { assembleJDAnalyzerPrompt, MODEL as JD_ANALYZER_MODEL } from './prompts/jd-analyzer.js';
import { assembleJDMatchPrompt, MODEL as JD_MATCH_MODEL } from './prompts/jd-match.js';
import { assembleJobResumePrompt, MODEL as JOB_RESUME_MODEL } from './prompts/job-resume.js';
import { assembleJobCoverPrompt, MODEL as JOB_COVER_MODEL } from './prompts/job-cover.js';
import { assembleResumeEvalBasePrompt, MODEL as EVAL_BASE_MODEL } from './prompts/resume-eval-base.js';
import { assembleResumeEvalJDPrompt, MODEL as EVAL_JD_MODEL } from './prompts/resume-eval-jd.js';
import { assembleResumeEvalRewritePrompt, MODEL as EVAL_REWRITE_MODEL } from './prompts/resume-eval-rewrite.js';
import { checkRateLimit, getCount, RATE_LIMITS } from './rateLimiter.js';

const ALLOWED_ORIGINS = [
  'https://a920604a.github.io',
  'http://localhost:3000',
];

const analytics = {
  track: (event, data) => {
    // placeholder — wire up a real analytics service here
    console.log('[analytics]', event, data);
  },
};

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}


async function handleJDAnalysis(request, env, origin) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  const { jd } = body;
  if (!jd || typeof jd !== 'string' || jd.trim().length === 0) {
    return new Response(JSON.stringify({ error: 'JD text is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }
  if (jd.length > 5000) {
    return new Response(JSON.stringify({ error: 'JD text too long (max 5000 chars)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rl = await checkRateLimit(env.RATE_LIMIT_KV, ip, RATE_LIMITS.analyzeJD);
  if (rl.limited) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }), {
      status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(rl.retryAfter), ...corsHeaders(origin) },
    });
  }

  // 1. Embed JD
  const embedResult = await env.AI.run('@cf/baai/bge-m3', { text: jd.slice(0, 2000) });
  const queryVector = embedResult.data[0];

  // 2. Vector search (topK=8)
  const searchResult = await env.VECTORIZE.query(queryVector, { topK: 8, returnMetadata: 'all' });
  const docs = (searchResult.matches || [])
    .filter((m) => m.metadata?.text)
    .map((m) => m.metadata.text);

  // 3. Build prompt
  const prompt = assembleJDAnalyzerPrompt(docs, jd);

  // 4. Stream LLM
  const aiStream = await env.AI.run(JD_ANALYZER_MODEL, {
    messages: [{ role: 'user', content: prompt }],
    stream: true,
    max_tokens: 4096,
  });

  return new Response(aiStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-RateLimit-Remaining': String(rl.remaining),
      ...corsHeaders(origin),
    },
  });
}


async function handleQuery(request, env, origin) {
  const { query } = await request.json();
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return new Response(JSON.stringify({ error: 'Missing or invalid query' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Query length guard
  if (query.length > 1000) {
    return new Response(JSON.stringify({ error: 'Query too long (max 1000 characters)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rl = await checkRateLimit(env.RATE_LIMIT_KV, ip, RATE_LIMITS.query);
  if (rl.limited) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait a minute.' }), {
      status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(rl.retryAfter) },
    });
  }

  analytics.track('query_sent', { query });

  // Cache check
  const cacheKey = new Request(`https://cache.internal/query/${await sha256(query)}`);
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) {
    return new Response(cached.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Cache': 'HIT',
        'X-RateLimit-Remaining': String(rl.remaining),
        ...corsHeaders(origin),
      },
    });
  }

  // 1. Embed query
  const embedResult = await env.AI.run('@cf/baai/bge-m3', {
    text: query,
  });
  const queryVector = embedResult.data[0];

  // 2. Vector search
  const searchResult = await env.VECTORIZE.query(queryVector, {
    topK: 5,
    returnMetadata: 'all',
  });
  const docs = (searchResult.matches || [])
    .filter((m) => m.metadata?.text)
    .map((m) => m.metadata.text);

  // 3. Build prompt
  const prompt = assembleQueryPrompt(docs, query);

  // 4. Stream LLM
  const aiStream = await env.AI.run(QUERY_MODEL, {
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  });

  analytics.track('response_streamed');

  // 5. Return ReadableStream — tee for optional caching
  const [responseStream, cacheStream] = aiStream.tee();

  // Store cache in background (non-blocking)
  const cacheResponse = new Response(cacheStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'public, max-age=86400',
    },
  });
  env.ctx?.waitUntil(cache.put(cacheKey, cacheResponse));

  return new Response(responseStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Cache': 'MISS',
      'X-RateLimit-Remaining': String(rl.remaining),
    },
  });
}

async function handleJDMatch(request, env, origin) {
  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  const { jd } = body;
  if (!jd || typeof jd !== 'string' || jd.trim().length === 0) {
    return new Response(JSON.stringify({ error: 'JD text is required' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }
  if (jd.length > 5000) {
    return new Response(JSON.stringify({ error: 'JD text too long (max 5000 chars)' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rl = await checkRateLimit(env.RATE_LIMIT_KV, ip, RATE_LIMITS.matchJD);
  if (rl.limited) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }), {
      status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(rl.retryAfter), ...corsHeaders(origin) },
    });
  }

  const embedResult = await env.AI.run('@cf/baai/bge-m3', { text: jd.slice(0, 2000) });
  const queryVector = embedResult.data[0];
  const searchResult = await env.VECTORIZE.query(queryVector, { topK: 8, returnMetadata: 'all' });
  const docs = (searchResult.matches || []).filter((m) => m.metadata?.text).map((m) => m.metadata.text);

  const prompt = assembleJDMatchPrompt(docs, jd);
  const aiStream = await env.AI.run(JD_MATCH_MODEL, {
    messages: [{ role: 'user', content: prompt }],
    stream: true,
    max_tokens: 4096,
  });

  return new Response(aiStream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'X-RateLimit-Remaining': String(rl.remaining), ...corsHeaders(origin) },
  });
}

async function fetchCandidateProfile() {
  const BASE = 'https://a920604a.github.io/self-reusme-website';
  const [profile, works, projects, skills] = await Promise.all([
    fetch(`${BASE}/data/profile.json`).then((r) => r.json()).catch(() => ({})),
    fetch(`${BASE}/data/works.json`).then((r) => r.json()).catch(() => []),
    fetch(`${BASE}/data/projects.json`).then((r) => r.json()).catch(() => []),
    fetch(`${BASE}/data/skills.json`).then((r) => r.json()).catch(() => ({})),
  ]);
  return JSON.stringify({ profile, works, projects, skills }, null, 2);
}

async function handleJobResume(request, env, origin) {
  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  const { jd, matchSummary } = body;
  if (!jd || !matchSummary || typeof jd !== 'string' || typeof matchSummary !== 'string') {
    return new Response(JSON.stringify({ error: 'Missing required fields: jd, matchSummary' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rl = await checkRateLimit(env.RATE_LIMIT_KV, ip, RATE_LIMITS.applyJob);
  if (rl.limited) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }), {
      status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(rl.retryAfter), ...corsHeaders(origin) },
    });
  }

  const candidateProfile = await fetchCandidateProfile();
  const prompt = assembleJobResumePrompt(jd, matchSummary, candidateProfile);
  const aiStream = await env.AI.run(JOB_RESUME_MODEL, {
    messages: [{ role: 'user', content: prompt }],
    stream: true,
    max_tokens: 4096,
  });

  return new Response(aiStream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'X-RateLimit-Remaining': String(rl.remaining), ...corsHeaders(origin) },
  });
}

async function handleJobCover(request, env, origin) {
  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  const { jd, matchSummary } = body;
  if (!jd || !matchSummary || typeof jd !== 'string' || typeof matchSummary !== 'string') {
    return new Response(JSON.stringify({ error: 'Missing required fields: jd, matchSummary' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rl = await checkRateLimit(env.RATE_LIMIT_KV, ip, RATE_LIMITS.applyJob);
  if (rl.limited) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }), {
      status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(rl.retryAfter), ...corsHeaders(origin) },
    });
  }

  const candidateProfile = await fetchCandidateProfile();
  const prompt = assembleJobCoverPrompt(jd, matchSummary, candidateProfile);
  const aiStream = await env.AI.run(JOB_COVER_MODEL, {
    messages: [{ role: 'user', content: prompt }],
    stream: true,
    max_tokens: 2048,
  });

  return new Response(aiStream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'X-RateLimit-Remaining': String(rl.remaining), ...corsHeaders(origin) },
  });
}

async function handleHealthCheck(request, env, origin) {
  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  const { mode, jd } = body;
  if (!mode || !['base', 'jd'].includes(mode)) {
    return new Response(JSON.stringify({ error: 'mode must be "base" or "jd"' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }
  if (mode === 'jd' && (!jd || typeof jd !== 'string' || jd.trim().length === 0)) {
    return new Response(JSON.stringify({ error: 'JD text required for jd mode' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }
  if (mode === 'jd' && jd.length > 5000) {
    return new Response(JSON.stringify({ error: 'JD text too long (max 5000 chars)' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rl = await checkRateLimit(env.RATE_LIMIT_KV, ip, RATE_LIMITS.healthCheck);
  if (rl.limited) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }), {
      status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(rl.retryAfter), ...corsHeaders(origin) },
    });
  }

  const BASE = 'https://a920604a.github.io/self-reusme-website';
  const [profile, works, projects, skills] = await Promise.all([
    fetch(`${BASE}/data/profile.json`).then((r) => r.json()).catch(() => ({})),
    fetch(`${BASE}/data/works.json`).then((r) => r.json()).catch(() => []),
    fetch(`${BASE}/data/projects.json`).then((r) => r.json()).catch(() => []),
    fetch(`${BASE}/data/skills.json`).then((r) => r.json()).catch(() => ({})),
  ]);

  // Compact summary to keep input tokens manageable for scoring calls
  const candidateData = JSON.stringify({
    name: profile.name,
    bio: profile.bio,
    skills: skills,
    works: (works || []).map((w) => ({
      company: w.company, role: w.role, period: w.period,
      highlights: (w.highlights || w.bullets || []).slice(0, 3),
    })),
    projects: (projects || []).slice(0, 6).map((p) => ({
      name: p.name, description: p.description,
      tech: p.tech || p.techStack || [],
    })),
  });

  function extractJSON(text) {
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    // Direct parse
    try { return JSON.parse(clean); } catch { }
    // Extract first {...} block
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) { try { return JSON.parse(match[0]); } catch { } }
    throw new Error(`Cannot parse JSON from model output: ${text.slice(0, 300)}`);
  }

  async function scoringCall(prompt, model) {
    const attempt = async () => {
      const result = await env.AI.run(model, {
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2048,
      });
      const text = result.response ?? '';
      return extractJSON(text);
    };
    try {
      return await attempt();
    } catch (e1) {
      console.error('[health-check] scoring attempt 1 failed:', e1.message);
      try {
        return await attempt();
      } catch (e2) {
        console.error('[health-check] scoring attempt 2 failed:', e2.message);
        throw e2;
      }
    }
  }

  let scores;
  try {
    const basePrompt = assembleResumeEvalBasePrompt(candidateData);
    if (mode === 'base') {
      scores = await scoringCall(basePrompt, EVAL_BASE_MODEL);
    } else {
      const jdPrompt = assembleResumeEvalJDPrompt(candidateData, jd);
      const [baseScores, jdScores] = await Promise.all([
        scoringCall(basePrompt, EVAL_BASE_MODEL),
        scoringCall(jdPrompt, EVAL_JD_MODEL),
      ]);
      scores = { ...baseScores, ...jdScores };
    }
  } catch (err) {
    console.error('[health-check] scoring failed:', err.message);
    return new Response(JSON.stringify({ error: 'Scoring failed', detail: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  const rewritePrompt = assembleResumeEvalRewritePrompt(JSON.stringify(scores, null, 2), candidateData);
  const aiStream = await env.AI.run(EVAL_REWRITE_MODEL, {
    messages: [{ role: 'user', content: rewritePrompt }],
    stream: true,
    max_tokens: 4096,
  });

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    try {
      await writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'scores', data: scores })}\n\n`));
      const reader = aiStream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        await writer.write(value);
      }
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'X-RateLimit-Remaining': String(rl.remaining), ...corsHeaders(origin) },
  });
}

async function handleUsage(request, env, origin) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const [query, analyzeJD, matchJD, applyJob, healthCheck] = await Promise.all([
    getCount(env.RATE_LIMIT_KV, ip, RATE_LIMITS.query),
    getCount(env.RATE_LIMIT_KV, ip, RATE_LIMITS.analyzeJD),
    getCount(env.RATE_LIMIT_KV, ip, RATE_LIMITS.matchJD),
    getCount(env.RATE_LIMIT_KV, ip, RATE_LIMITS.applyJob),
    getCount(env.RATE_LIMIT_KV, ip, RATE_LIMITS.healthCheck),
  ]);
  return new Response(JSON.stringify({ query, analyzeJD, matchJD, applyJob, healthCheck }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

export default {
  async fetch(request, env, ctx) {
    env.ctx = ctx;
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin);
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (url.pathname === '/usage' && request.method === 'GET') {
      return handleUsage(request, env, origin);
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    try {
      let response;
      if (url.pathname === '/analyze-jd') {
        response = await handleJDAnalysis(request, env, origin);
      } else if (url.pathname === '/match-jd') {
        response = await handleJDMatch(request, env, origin);
      } else if (url.pathname === '/apply-resume') {
        response = await handleJobResume(request, env, origin);
      } else if (url.pathname === '/apply-cover') {
        response = await handleJobCover(request, env, origin);
      } else if (url.pathname === '/health-check') {
        response = await handleHealthCheck(request, env, origin);
      } else {
        response = await handleQuery(request, env, origin);
        Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v));
      }
      return response;
    } catch (err) {
      console.error('[worker error]', err);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  },
};

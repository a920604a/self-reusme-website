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

function assembleJDPrompt(docs, jdText) {
  const profile = docs.length > 0 ? docs.join('\n\n') : 'No specific context found.';
  return `You are analyzing job fit for a software engineer's portfolio. Given the job description and candidate profile below, produce a structured fit analysis in Markdown with exactly these four sections:
## Key Requirements Match
## Relevant Projects
## Candidate Strengths for This Role
## Potential Gaps

Be specific, concise, and reference actual projects or skills from the candidate profile. Reply in the same language as the job description.

Job Description:
${jdText}

Candidate Profile:
${profile}

Analysis:`;
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

  // Rate limiting: 5 requests per IP per hour
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rateLimitKey = `rl-jd:${ip}:${Math.floor(Date.now() / 3600000)}`;
  const currentCount = parseInt((await env.RATE_LIMIT_KV.get(rateLimitKey)) || '0');
  if (currentCount >= 5) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': '3600', ...corsHeaders(origin) },
    });
  }
  await env.RATE_LIMIT_KV.put(rateLimitKey, String(currentCount + 1), { expirationTtl: 7200 });

  // 1. Embed JD
  const embedResult = await env.AI.run('@cf/baai/bge-m3', { text: jd.slice(0, 2000) });
  const queryVector = embedResult.data[0];

  // 2. Vector search (topK=8)
  const searchResult = await env.VECTORIZE.query(queryVector, { topK: 8, returnMetadata: 'all' });
  const docs = (searchResult.matches || [])
    .filter((m) => m.metadata?.text)
    .map((m) => m.metadata.text);

  // 3. Build prompt
  const prompt = assembleJDPrompt(docs, jd);

  // 4. Stream LLM
  const aiStream = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  });

  return new Response(aiStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      ...corsHeaders(origin),
    },
  });
}

function assemblePrompt(docs, query) {
  const context = docs.length > 0 ? docs.join('\n\n') : 'No specific context found.';
  return `You are an AI assistant for a software engineer's personal portfolio website. Answer questions about the engineer's projects, work experience, and skills based on the context below. Be concise, helpful, and professional. If the context doesn't cover the question, answer based on general knowledge. IMPORTANT: Always reply in the same language the user used.

Context:
${context}

User: ${query}

Answer:`;
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

  // Rate limiting: 20 requests per IP per minute
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rateLimitKey = `rl:${ip}:${Math.floor(Date.now() / 60000)}`;
  const currentCount = parseInt((await env.RATE_LIMIT_KV.get(rateLimitKey)) || '0');
  if (currentCount >= 20) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait a minute.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
    });
  }
  await env.RATE_LIMIT_KV.put(rateLimitKey, String(currentCount + 1), { expirationTtl: 120 });

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
  const prompt = assemblePrompt(docs, query);

  // 4. Stream LLM
  const aiStream = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
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
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    env.ctx = ctx;
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(request.url);

    try {
      let response;
      if (url.pathname === '/analyze-jd') {
        response = await handleJDAnalysis(request, env, origin);
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

export const RATE_LIMITS = {
  query:       { limit: 20, windowSecs: 86400, prefix: 'rl:' },
  analyzeJD:   { limit: 10, windowSecs: 86400, prefix: 'rl-jd:' },
  matchJD:     { limit: 5,  windowSecs: 86400, prefix: 'rl-private:match:' },
  applyJob:    { limit: 5,  windowSecs: 86400, prefix: 'rl-private:apply:' },
  healthCheck: { limit: 10, windowSecs: 86400, prefix: 'rl-private:health:' },
};

export async function checkRateLimit(kv, ip, { limit, windowSecs, prefix }) {
  const windowId = Math.floor(Date.now() / (windowSecs * 1000));
  const key = `${prefix}${ip}:${windowId}`;
  const count = parseInt((await kv.get(key)) || '0');
  if (count >= limit) return { limited: true, retryAfter: windowSecs, remaining: 0 };
  await kv.put(key, String(count + 1), { expirationTtl: windowSecs * 2 });
  return { limited: false, remaining: limit - count - 1 };
}

export async function getCount(kv, ip, { limit, windowSecs, prefix }) {
  const windowId = Math.floor(Date.now() / (windowSecs * 1000));
  const key = `${prefix}${ip}:${windowId}`;
  const count = parseInt((await kv.get(key)) || '0');
  return { remaining: Math.max(0, limit - count), limit };
}

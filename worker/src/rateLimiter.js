export const RATE_LIMITS = {
  query: { limit: 20, windowSecs: 60, prefix: 'rl:' },
  analyzeJD: { limit: 5, windowSecs: 3600, prefix: 'rl-jd:' },
  matchJD: { limit: 10, windowSecs: 3600, prefix: 'rl-private:match:' },
  applyJob: { limit: 10, windowSecs: 3600, prefix: 'rl-private:apply:' },
  healthCheck: { limit: 5, windowSecs: 3600, prefix: 'rl-private:health:' },
};

export async function checkRateLimit(kv, ip, { limit, windowSecs, prefix }) {
  const windowId = Math.floor(Date.now() / (windowSecs * 1000));
  const key = `${prefix}${ip}:${windowId}`;
  const count = parseInt((await kv.get(key)) || '0');
  if (count >= limit) return { limited: true, retryAfter: windowSecs };
  await kv.put(key, String(count + 1), { expirationTtl: windowSecs * 2 });
  return { limited: false };
}

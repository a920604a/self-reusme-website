import { useState, useCallback, useRef } from 'react';

const WORKER_URL = process.env.REACT_APP_WORKER_URL || 'http://localhost:8787';

async function streamToState(url, body, signal, setter) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  const remaining = parseInt(response.headers.get('X-RateLimit-Remaining') ?? '-1');

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Something went wrong');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') continue;
      try {
        const parsed = JSON.parse(data);
        const token = parsed.response ?? parsed.token ?? '';
        if (!token) continue;
        fullText += token;
        setter(fullText);
      } catch { /* skip malformed SSE */ }
    }
  }

  return remaining;
}

function useJobApply() {
  const [resumeText, setResumeText] = useState('');
  const [coverText, setCoverText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const [remaining, setRemaining] = useState(null);
  const abortRef = useRef(null);

  const apply = useCallback(async (jd, matchSummary) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setResumeText('');
    setCoverText('');
    setError('');
    setIsStreaming(true);

    const payload = { jd, matchSummary };

    try {
      const [rem1, rem2] = await Promise.all([
        streamToState(`${WORKER_URL}/apply-resume`, payload, controller.signal, setResumeText),
        streamToState(`${WORKER_URL}/apply-cover`, payload, controller.signal, setCoverText),
      ]);
      const valid = [rem1, rem2].filter((r) => r >= 0);
      if (valid.length > 0) setRemaining(Math.min(...valid));
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message || 'Connection error. Please try again.');
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => { setResumeText(''); setCoverText(''); setError(''); }, []);

  return { resumeText, coverText, isStreaming, error, apply, stop, reset, remaining };
}

export default useJobApply;

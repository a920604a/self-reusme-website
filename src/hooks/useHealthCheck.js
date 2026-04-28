import { useState, useCallback, useRef } from 'react';

const WORKER_URL = process.env.REACT_APP_WORKER_URL || 'http://localhost:8787';

function useHealthCheck() {
  const [scores, setScores] = useState(null);
  const [isLoadingScores, setIsLoadingScores] = useState(false);
  const [suggestions, setSuggestions] = useState('');
  const [isStreamingSuggestions, setIsStreamingSuggestions] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef(null);

  const check = useCallback(async (mode, jd = '') => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setScores(null);
    setSuggestions('');
    setError('');
    setIsLoadingScores(true);
    setIsStreamingSuggestions(false);

    try {
      const response = await fetch(`${WORKER_URL}/health-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, ...(mode === 'jd' ? { jd } : {}) }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Unknown error' }));
        setError(err.error || 'Something went wrong');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

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
            if (parsed.type === 'scores') {
              setScores(parsed.data);
              setIsLoadingScores(false);
              setIsStreamingSuggestions(true);
            } else {
              const token = parsed.response ?? parsed.token ?? '';
              if (token) setSuggestions((prev) => prev + token);
            }
          } catch { /* skip malformed SSE */ }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') setError('Connection error. Please try again.');
    } finally {
      setIsLoadingScores(false);
      setIsStreamingSuggestions(false);
      abortRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setIsLoadingScores(false);
    setIsStreamingSuggestions(false);
  }, []);

  const reset = useCallback(() => {
    setScores(null);
    setSuggestions('');
    setError('');
  }, []);

  return { scores, isLoadingScores, suggestions, isStreamingSuggestions, error, check, stop, reset };
}

export default useHealthCheck;

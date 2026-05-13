import { useState, useCallback, useRef } from 'react';

const WORKER_URL = process.env.REACT_APP_WORKER_URL || 'http://localhost:8787';

function useJDAnalysis() {
  const [result, setResult] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const [remaining, setRemaining] = useState(null);
  const abortRef = useRef(null);

  const analyze = useCallback(async (jdText) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setResult('');
    setError('');
    setIsStreaming(true);

    try {
      const response = await fetch(`${WORKER_URL}/analyze-jd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd: jdText }),
        signal: controller.signal,
      });

      const rem = response.headers.get('X-RateLimit-Remaining');
      if (rem !== null) setRemaining(parseInt(rem));

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Unknown error' }));
        setError(err.error || 'Something went wrong');
        setIsStreaming(false);
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
            const token = parsed.response ?? parsed.token ?? '';
            if (!token) continue;
            setResult((prev) => prev + token);
          } catch {
            // skip malformed SSE line
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Connection error. Please try again.');
      }
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    setResult('');
    setError('');
  }, []);

  return { result, isStreaming, error, analyze, stop, reset, remaining };
}

export default useJDAnalysis;

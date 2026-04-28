import { useState, useCallback, useRef } from 'react';

const WORKER_URL = process.env.REACT_APP_WORKER_URL || 'http://localhost:8787';

function useJobApply() {
  const [resumeText, setResumeText] = useState('');
  const [coverText, setCoverText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef(null);

  const apply = useCallback(async (jd, matchSummary) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setResumeText('');
    setCoverText('');
    setError('');
    setIsStreaming(true);

    try {
      const response = await fetch(`${WORKER_URL}/apply-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd, matchSummary }),
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
            // Split on <!-- COVER_START --> marker
            const coverIdx = fullText.indexOf('<!-- COVER_START -->');
            if (coverIdx !== -1) {
              setResumeText(fullText.slice(fullText.indexOf('<!-- RESUME_START -->') !== -1
                ? fullText.indexOf('<!-- RESUME_START -->') + '<!-- RESUME_START -->'.length
                : 0, coverIdx).trim());
              setCoverText(fullText.slice(coverIdx + '<!-- COVER_START -->'.length).trim());
            } else {
              const resumeIdx = fullText.indexOf('<!-- RESUME_START -->');
              setResumeText(fullText.slice(resumeIdx !== -1 ? resumeIdx + '<!-- RESUME_START -->'.length : 0).trim());
            }
          } catch { /* skip malformed SSE */ }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') setError('Connection error. Please try again.');
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

  return { resumeText, coverText, isStreaming, error, apply, stop, reset };
}

export default useJobApply;

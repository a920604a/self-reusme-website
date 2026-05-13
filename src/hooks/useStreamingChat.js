import { useState, useCallback, useRef, useEffect } from 'react';

const WORKER_URL = process.env.REACT_APP_WORKER_URL || 'http://localhost:8787';

function useStreamingChat() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [remaining, setRemaining] = useState(null);
  const abortRef = useRef(null);

  const sendMessage = useCallback(async (text) => {
    // Cancel any in-flight request before starting a new one
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const userMessage = { role: 'user', content: text };
    const assistantPlaceholder = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
    setIsStreaming(true);

    try {
      const response = await fetch(`${WORKER_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
        signal: controller.signal,
      });

      const rem = response.headers.get('X-RateLimit-Remaining');
      if (rem !== null) setRemaining(parseInt(rem));

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Unknown error' }));
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: 'assistant', content: `Error: ${err.error || 'Something went wrong'}` };
          return next;
        });
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
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              next[next.length - 1] = { ...last, content: last.content + token };
              return next;
            });
          } catch {
            // skip malformed SSE line
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return; // User cancelled — no error message
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: 'assistant',
          content: 'Something went wrong, please try again.',
        };
        return next;
      });
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, []);

  const clearMessages = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setMessages([]);
  }, []);

  const cancelStreaming = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
  }, []);

  // Persist messages to localStorage (skip empty assistant placeholder during streaming)
  const stableMessages = messages.filter((m) => m.content || m.role === 'user');
  useEffect(() => {
    try {
      localStorage.setItem('chat_history', JSON.stringify(stableMessages));
    } catch {
      // storage quota exceeded — ignore
    }
  }, [stableMessages]);

  return { messages, isStreaming, sendMessage, clearMessages, cancelStreaming, remaining };
}

export default useStreamingChat;

import { useState, useEffect, useCallback } from 'react';

const WORKER_URL = process.env.REACT_APP_WORKER_URL || 'http://localhost:8787';

function useUsage() {
  const [usage, setUsage] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${WORKER_URL}/usage`);
      if (res.ok) setUsage(await res.json());
    } catch {}
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { usage, refresh };
}

export default useUsage;

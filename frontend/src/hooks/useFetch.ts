import { useState, useEffect } from 'react';
import { fetchApi } from '../lib/api';

export function useFetch<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchApi<T>(endpoint);
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Fetch failed');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [endpoint]);

  return { data, loading, error };
}

import { useState, useEffect, useCallback } from 'react';
import API from '../api/api';

export default function useApi(endpoint, params = null, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetcher = useCallback(async (overrideParams) => {
    setLoading(true); setError(null);
    try {
      const res = await API.get(endpoint, { params: overrideParams || params });
      setData(res.data);
    } catch (err) {
      setError(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(params), ...deps]);

  useEffect(() => { fetcher(); }, [fetcher]);

  return { data, loading, error, refetch: fetcher, setData };
}

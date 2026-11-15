import { useCallback, useEffect, useRef, useState } from 'react';
import { parseApiError } from '../../infrastructure/http/axiosClient';
import type { Paginated } from '../../domain/models/api';

/** Lista paginada con búsqueda (debounce 400 ms). `extra` son filtros adicionales. */
export function useApiList<T, E extends object = Record<string, never>>(
  fetcher: (q: { page: number; pageSize: number; search: string } & E) => Promise<Paginated<T>>,
  extra: E = {} as E,
  pageSize = 20,
) {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [data, setData] = useState<Paginated<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const extraKey = JSON.stringify(extra);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [extraKey]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcherRef
      .current({ page, pageSize, search, ...(JSON.parse(extraKey) as E) })
      .then((res) => !cancelled && setData(res))
      .catch((e) => !cancelled && setError(parseApiError(e).message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, search, extraKey, tick]);

  const reload = useCallback(() => setTick((n) => n + 1), []);

  return { data, loading, error, page, setPage, searchInput, setSearchInput, reload, pageSize };
}

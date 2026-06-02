import { useCallback, useEffect, useState } from 'react';
import catalogService from '../services/catalog';

/**
 * Charge la liste des catalogues avec annulation au démontage.
 * @param {{ forAdmin?: boolean }} [options]
 * @returns {{ catalogs: object[], setCatalogs: Function, loading: boolean, reload: Function }}
 */
export function useCatalogs({ forAdmin = false } = {}) {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    return forAdmin ? catalogService.getAdminAll() : catalogService.getAll();
  }, [forAdmin]);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const list = await load();
      setCatalogs(Array.isArray(list) ? list : []);
    } catch {
      setCatalogs([]);
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await load();
        if (cancelled) return;
        const list = res;
        setCatalogs(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setCatalogs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  return { catalogs, setCatalogs, loading, reload };
}

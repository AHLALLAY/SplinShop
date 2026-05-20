import { useCallback, useEffect, useState } from 'react';
import catalog from '../services/catalog';

/**
 * Charge la liste des catalogues avec annulation au démontage.
 * @param {{ forAdmin?: boolean }} [options]
 */
export function useCatalogs({ forAdmin = false } = {}) {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = forAdmin ? catalog.loadCatalogAdmin : catalog.loadCatalog;

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await load();
      const list = res?.data;
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
        const list = res?.data;
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

import { useCallback, useEffect, useState } from 'react';
import catalog from '../services/catalog';

/**
 * Charge la liste des catalogues avec annulation au démontage.
 */
export function useCatalogs() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await catalog.loadCatalog();
      const list = res?.data;
      setCatalogs(Array.isArray(list) ? list : []);
    } catch {
      setCatalogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await catalog.loadCatalog();
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
  }, []);

  return { catalogs, setCatalogs, loading, reload };
}

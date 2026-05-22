import { useCallback, useEffect, useState } from 'react';

/**
 * Charge des données async avec annulation à la destruction.
 * @template T
 * @param {() => Promise<T>} fetcher
 * @param {unknown[]} deps - Dépendances du chargement (comme useEffect)
 * @returns {{ data: T, loading: boolean, error: Error|null, reload: () => Promise<void> }}
 */
export function useAsyncData(fetcher, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const reload = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetcher();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
            setData(null);
        } finally {
            setLoading(false);
        }
    }, deps);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await fetcher();
                if (!cancelled) setData(result);
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err : new Error(String(err)));
                    setData(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, deps);

    return { data, loading, error, reload };
}

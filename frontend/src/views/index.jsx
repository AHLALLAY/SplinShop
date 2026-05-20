import CatalogCard from '../components/catalog/CatalogCard';
import { useCatalogs } from '../hooks/useCatalogs';

export default function Vitrine() {
    const { catalogs, loading } = useCatalogs();

    return (
        <>
            {loading && <p className="mb-4 text-sm text-stone-500">Chargement du catalogue…</p>}
            <CatalogCard data={catalogs} />
        </>
    );
}

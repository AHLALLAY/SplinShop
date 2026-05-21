import CatalogCard from '../components/catalog/CatalogCard';
import { useCatalogs } from '../hooks/useCatalogs';
import { useNavigate } from 'react-router-dom';
import { resolveCatalogSlug } from '../utils/catalogResolve';

export default function Vitrine() {
    const { catalogs, loading } = useCatalogs();
    const navigate = useNavigate();

    const openCatalogProducts = (item) => {
        const slug = resolveCatalogSlug(item);
        if (!slug) return;
        navigate(`/catalog/${encodeURIComponent(slug)}/products`);
    };

    return (
        <>
            {loading && <p className="mb-4 text-sm text-stone-500">Chargement du catalogue…</p>}
            <CatalogCard data={catalogs} onClick={openCatalogProducts} />
        </>
    );
}

import CatalogCard from '../components/catalog/CatalogCard';
import { useCatalogs } from '../hooks/useCatalogs';
import { useNavigate } from 'react-router-dom';
import { navigateToCatalogProducts } from '../utils/navigation';
import HeroSection from '../components/catalog/heroSection';

export default function Vitrine() {
    const { catalogs, loading } = useCatalogs();
    const navigate = useNavigate();

    const openCatalogProducts = (item) => {
        navigateToCatalogProducts(navigate, item);
    };

    return (
        <div className="flex flex-col gap-8">
            <HeroSection />
            <div>
                <h2 className="text-xl font-bold text-stone-800 mb-5">Nos Catalogues</h2>
                {loading && <p className="mb-4 text-sm text-stone-500">Chargement du catalogue…</p>}
                <CatalogCard data={catalogs} onClick={openCatalogProducts} />
            </div>
        </div>
    );
}

import { Link, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import catalog from '../../services/catalog';
import productService from '../../services/product';
import Button from '../../components/ui/Button';
import ProductModal from '../../components/product/ProductModal';
import ProductCard from '../../components/product/ProductCard';
import { resolveCatalogSlug } from '../../utils/catalogResolve';
import { isAdmin } from '../../utils/authSession';

export default function Product() {
    const { catalogSlug } = useParams();
    const adminView = isAdmin();
    const [show, setShow] = useState(false);
    const [catalogName, setCatalogName] = useState('');
    const [catalogId, setCatalogId] = useState(null);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingCatalog, setLoadingCatalog] = useState(true);

    const loadProducts = useCallback(async (id) => {
        if (!id) {
            setProducts([]);
            return;
        }
        setLoadingProducts(true);
        try {
            const list = await productService.loadByCatalog(id);
            setProducts(Array.isArray(list) ? list : []);
        } catch {
            setProducts([]);
        } finally {
            setLoadingProducts(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (!catalogSlug) {
                setLoadingCatalog(false);
                return;
            }
            setLoadingCatalog(true);
            try {
                const res = adminView
                    ? await catalog.loadCatalogAdmin()
                    : await catalog.loadCatalog();
                if (cancelled) return;
                const list = Array.isArray(res?.data) ? res.data : [];
                const decodedSlug = decodeURIComponent(catalogSlug);
                const found = list.find((c) => resolveCatalogSlug(c) === decodedSlug);
                setCatalogName(found?.name ?? '');
                const id = found?.id ?? null;
                setCatalogId(id);
                if (id) await loadProducts(id);
            } catch {
                if (!cancelled) {
                    setCatalogName('');
                    setCatalogId(null);
                    setProducts([]);
                }
            } finally {
                if (!cancelled) setLoadingCatalog(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [catalogSlug, loadProducts, adminView]);

    const closeModal = () => {
        setShow(false);
        loadProducts(catalogId);
    };

    const handleEdit = (item) => {
        window.alert(`Modification de « ${item.name} » — à brancher prochainement.`);
    };

    const handleDelete = (item) => {
        const label = item?.name ? `« ${item.name} »` : 'ce produit';
        if (!window.confirm(`Supprimer ${label} ?`)) return;
        window.alert("La suppression sera disponible lorsque l'API sera en place.");
    };

    const backTo = adminView ? '/admin/catalog' : '/';

    return (
        <div className="flex flex-col gap-6">
            <Link
                to={backTo}
                className="text-sm font-medium text-amber-700 hover:text-amber-900 hover:underline w-fit"
            >
                ← Retour au catalogue
            </Link>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-amber-600 font-bold text-2xl">
                    {catalogName ? (
                        <>
                            <span>{catalogName}</span>
                            <span className="text-stone-500 font-semibold">&gt;</span>
                            <span>Produits</span>
                        </>
                    ) : (
                        'Produits'
                    )}
                </h1>
                {adminView && (
                    <Button className="px-2" onClick={() => setShow(true)} disabled={!catalogId}>
                        Ajouter
                    </Button>
                )}
            </div>

            {loadingCatalog && (
                <p className="text-sm text-stone-500">Chargement de la catégorie…</p>
            )}

            {!loadingCatalog && !catalogId && catalogSlug && (
                <p className="text-sm text-red-600">
                    Catégorie introuvable pour ce lien. Vérifiez le slug ou retournez au catalogue.
                </p>
            )}

            {loadingProducts ? (
                <p className="text-sm text-stone-500">Chargement des produits…</p>
            ) : (
                <ProductCard
                    data={products}
                    adminMode={adminView}
                    onEdit={adminView ? handleEdit : undefined}
                    onDelete={adminView ? handleDelete : undefined}
                />
            )}

            {adminView && (
                <ProductModal
                    key={show ? 'open' : 'closed'}
                    visibility={show}
                    catalogId={catalogId}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}

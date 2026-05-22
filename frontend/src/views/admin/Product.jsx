import { Link, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import catalogService from '../../services/catalog';
import productService from '../../services/product';
import Button from '../../components/ui/Button';
import ProductModal from '../../components/product/ProductModal';
import ProductCard from '../../components/product/ProductCard';
import ProductSearchBar from '../../components/product/ProductSearchBar';
import { isAdmin } from '../../utils/authSession';
import { filterProductsByQuery } from '../../utils/filterProducts';

export default function Product({ adminContext = false }) {
    const { catalogSlug } = useParams();
    const adminView = adminContext || isAdmin();
    const [show, setShow] = useState(false);
    const [catalogName, setCatalogName] = useState('');
    const [catalogId, setCatalogId] = useState(null);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingCatalog, setLoadingCatalog] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [actionMessage, setActionMessage] = useState('');

    const filteredProducts = useMemo(
        () => filterProductsByQuery(products, searchQuery),
        [products, searchQuery],
    );

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
                const decodedSlug = decodeURIComponent(catalogSlug);
                const found = await catalogService.loadBySlug(decodedSlug);
                if (cancelled) return;
                setCatalogName(found?.name ?? '');
                const id = found?.id ?? null;
                setCatalogId(id);
                if (id) {
                    setSearchQuery('');
                    await loadProducts(id);
                }
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
    }, [catalogSlug, loadProducts]);

    const closeModal = () => {
        setShow(false);
        loadProducts(catalogId);
    };

    const handleEdit = (item) => {
        setActionMessage(`Modification de « ${item.name} » — à brancher prochainement.`);
    };

    const handleDelete = (item) => {
        const label = item?.name ? `« ${item.name} »` : 'ce produit';
        if (!window.confirm(`Supprimer ${label} ?`)) return;
        setActionMessage("La suppression sera disponible lorsque l'API sera en place.");
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

            {actionMessage && (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200">
                    {actionMessage}
                </p>
            )}

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

            {catalogId && !loadingCatalog && (
                <ProductSearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    className="max-w-xl"
                />
            )}

            {loadingProducts ? (
                <p className="text-sm text-stone-500">Chargement des produits…</p>
            ) : (
                <>
                    {products.length > 0 && searchQuery.trim() && (
                        <p className="text-sm text-stone-500">
                            {filteredProducts.length === 0
                                ? `Aucun produit ne correspond à « ${searchQuery.trim()} ».`
                                : `${filteredProducts.length} produit${filteredProducts.length > 1 ? 's' : ''} trouvé${filteredProducts.length > 1 ? 's' : ''}`}
                        </p>
                    )}
                    {(filteredProducts.length > 0 || !searchQuery.trim()) && (
                        <ProductCard
                            data={filteredProducts}
                            adminMode={adminView}
                            onEdit={adminView ? handleEdit : undefined}
                            onDelete={adminView ? handleDelete : undefined}
                        />
                    )}
                </>
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

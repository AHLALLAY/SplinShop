import { Link, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import catalog from "../../services/catalog.js";
import productService from "../../services/product.js";
import Button from "../../components/ui/Button";
import ProductModal from "../../components/product/ProductModal.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";

export default function Product() {
    const { catalogSlug } = useParams();
    const [show, setShow] = useState(false);
    const [catalogName, setCatalogName] = useState("");
    const [catalogId, setCatalogId] = useState(null);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

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
            if (!catalogSlug) return;
            try {
                const res = await catalog.loadCatalog();
                if (cancelled) return;
                const list = Array.isArray(res?.data) ? res.data : [];
                const decodedSlug = decodeURIComponent(catalogSlug);
                const found = list.find((c) => c.slug === decodedSlug);
                setCatalogName(found?.name ?? "");
                const id = found?.id ?? null;
                setCatalogId(id);
                if (id) await loadProducts(id);
            } catch {
                if (!cancelled) {
                    setCatalogName("");
                    setCatalogId(null);
                    setProducts([]);
                }
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

    return (
        <div className="flex flex-col gap-6">
            <Link
                to="/admin/catalog"
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
                        "Produits"
                    )}
                </h1>
                <Button className="px-2" onClick={() => setShow(true)} disabled={!catalogId}>
                    Ajouter
                </Button>
            </div>

            {!catalogId && catalogSlug && (
                <p className="text-sm text-red-600">
                    Catégorie introuvable pour ce lien. Vérifiez le slug ou retournez au catalogue.
                </p>
            )}

            {loadingProducts ? (
                <p className="text-sm text-stone-500">Chargement des produits…</p>
            ) : (
                <ProductCard
                    data={products}
                    adminMode
                    onEdit={(item) => {
                        window.alert(
                            `Modification de « ${item.name} » — à brancher prochainement.`
                        );
                    }}
                    onDelete={(item) => {
                        const label = item?.name ? `« ${item.name} »` : "ce produit";
                        if (!window.confirm(`Supprimer ${label} ?`)) return;
                        window.alert("La suppression sera disponible lorsque l'API sera en place.");
                    }}
                />
            )}

            <ProductModal
                key={show ? "open" : "closed"}
                visibility={show}
                catalogId={catalogId}
                onClose={closeModal}
            />
        </div>
    );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import CatalogModal from '../../components/catalog/CatalogModal';
import CatalogCard from '../../components/catalog/CatalogCard';
import { useCatalogs } from '../../hooks/useCatalogs';
import { resolveCatalogSlug } from '../../utils/catalogResolve';
import catalogService from '../../services/catalog';

export default function Catalog() {
    const [show, setShow] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const { catalogs, reload, loading } = useCatalogs({ forAdmin: true });
    const navigate = useNavigate();

    const handleEdit = (item) => {
        setEditingItem(item);
        setShow(true);
    };

    const handleDelete = (item) => {
        const label = item?.name ? `« ${item.name} »` : 'cet élément';
        if (!window.confirm(`Supprimer ${label} du catalogue ?`)) return;
        // TODO(api): brancher DELETE catalog quand l’endpoint sera disponible
        window.alert("La suppression sera disponible lorsque l'API sera en place.");
    };

    const handleHide = async (item) => {
        if (!item?.id) return;

        const label = item.name ? `« ${item.name} »` : 'cette catégorie';
        const confirmMessage = item.isHidden
            ? `Afficher ${label} sur la boutique ?`
            : `Masquer ${label} ? Il ne sera plus visible sur la boutique.`;
        if (!window.confirm(confirmMessage)) return;

        try {
            await catalogService.hideCatalog(item.id);
            await reload();
        } catch (error) {
            console.error('Erreur visibilité catalogue:', error);
            window.alert(
                error?.message ||
                    (item.isHidden
                        ? 'Impossible d’afficher ce catalogue.'
                        : 'Impossible de masquer ce catalogue.'),
            );
        }
    };

    const loadProductOfCatalog = (item) => {
        const slug = resolveCatalogSlug(item);
        if (!slug) return;
        navigate(`/admin/catalog/${encodeURIComponent(slug)}/products`);
    };

    const closeModal = () => {
        setShow(false);
        setEditingItem(null);
        reload();
    };

    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                <h1 className="text-amber-600 font-bold text-2xl">Catalogue</h1>
                <Button
                    className="px-2"
                    onClick={() => {
                        setEditingItem(null);
                        setShow(true);
                    }}
                >
                    Ajouter
                </Button>
            </div>
            <div className="flex-1">
                {loading && <p className="mt-4 text-sm text-stone-500">Chargement des catalogues…</p>}
                <CatalogCard
                    data={catalogs}
                    adminMode
                    onClick={loadProductOfCatalog}
                    onEdit={handleEdit}
                    onHide={handleHide}
                    onDelete={handleDelete}
                />
                <CatalogModal
                    key={show ? (editingItem?.id ?? 'create') : 'closed'}
                    visibility={show}
                    item={editingItem}
                    onClose={closeModal}
                />
            </div>
        </div>
    );
}

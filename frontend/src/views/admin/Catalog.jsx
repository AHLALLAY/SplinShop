import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import CatalogModal from '../../components/catalog/CatalogModal';
import CatalogCard from '../../components/catalog/CatalogCard';
import { useCatalogs } from '../../hooks/useCatalogs';
import { navigateToCatalogProducts } from '../../utils/navigation';
import catalogService from '../../services/catalog';

export default function Catalog() {
    const [show, setShow] = useState(false);
    const [feedback, setFeedback] = useState('');
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
        setFeedback("La suppression sera disponible lorsque l'API DELETE sera en place.");
    };

    const handleHide = async (item) => {
        if (!item?.id) return;

        const label = item.name ? `« ${item.name} »` : 'cette catégorie';
        const confirmMessage = item.isHidden
            ? `Afficher ${label} sur la boutique ?`
            : `Masquer ${label} ? Il ne sera plus visible sur la boutique.`;
        if (!window.confirm(confirmMessage)) return;

        try {
            await catalogService.toggleVisibility(item.id);
            await reload();
        } catch (error) {
            console.error('Erreur visibilité catalogue:', error);
            setFeedback(
                error?.message ||
                    (item.isHidden
                        ? 'Impossible d’afficher ce catalogue.'
                        : 'Impossible de masquer ce catalogue.'),
            );
        }
    };

    const loadProductOfCatalog = (item) => {
        navigateToCatalogProducts(navigate, item, { admin: true });
    };

    const closeModal = () => {
        setShow(false);
        setEditingItem(null);
        reload();
    };

    return (
        <div className="flex flex-col">
            {feedback && (
                <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200">
                    {feedback}
                </p>
            )}
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

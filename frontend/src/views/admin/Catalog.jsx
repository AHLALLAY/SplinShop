import catalog from "../../services/catalog.js";
import Button from "../../components/ui/Button";
import CatalogModal from "../../components/catalog/CatalogModal.jsx";
import CatalogCard from "../../components/catalog/CatalogCard.jsx";
import { useEffect, useState } from "react";

export default function Catalog() {
    const [show, setshow] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [catalogs, setcatalogs] = useState([]);
    const loadCatalogs = async () => {
        let cancelled = false;
        try {
            const res = await catalog.loadCatalog();
            if (cancelled) return;
            const list = res?.data;
            setcatalogs(Array.isArray(list) ? list : []);
        } catch {
            if (!cancelled) setcatalogs([]);
        }
        return () => {
            cancelled = true;
        };
    };
    useEffect(() => {
        loadCatalogs();
    }, []);

    const handleEdit = (item) => {
        setEditingItem(item);
        setshow(true);
    };

    const handleDelete = (item) => {
        const label = item?.name ? `« ${item.name} »` : "cet élément";
        if (!window.confirm(`Supprimer ${label} du catalogue ?`)) return;
        window.alert("La suppression sera disponible lorsque l’API sera en place.");
    };

    const closeModal = () => {
        setshow(false);
        setEditingItem(null);
        loadCatalogs();
    };
    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                <h1 className="text-amber-600 font-bold text-2xl">Catalogue</h1>
                <Button
                    className="px-2"
                    onClick={() => {
                        setEditingItem(null);
                        setshow(true);
                    }}
                >
                    Ajouter
                </Button>
            </div>
            <div className="flex-1">
                <CatalogCard
                    data={catalogs}
                    adminMode
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                <CatalogModal
                    key={show ? (editingItem?.id ?? "create") : "closed"}
                    visibility={show}
                    item={editingItem}
                    onClose={closeModal}
                />
            </div>
        </div>
    );
}
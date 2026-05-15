import catalog from "../../services/catalog.js";
import Button from "../../components/ui/Button";
import CatalogModal from "../../components/catalog/CatalogModal.jsx";
import CatalogCard from "../../components/catalog/CatalogCard.jsx";
import { useEffect, useState } from "react";

export default function Catalog() {
    const [show, setshow] = useState(false);
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

    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                <h1 className="text-amber-600 font-bold text-2xl">Catalogue</h1>
                <Button className="px-2" onClick={() => setshow(true)}>
                    {"Ajouter"}
                </Button>
            </div>
            <div className="flex-1">
                <CatalogCard data={catalogs} />
                <CatalogModal visibility={show} onClose={() => { setshow(false); loadCatalogs(); }} />
            </div>
        </div>
    );
}
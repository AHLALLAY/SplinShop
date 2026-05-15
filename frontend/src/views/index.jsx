import CatalogCard from "../components/catalog/CatalogCard";
import catalog from "../services/catalog";
import { useState, useEffect } from "react";

export default function Vitrine() {
    const [catalogs, setcatalogs] = useState([]);
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await catalog.loadCatalog();
                if (cancelled) return;
                const list = res?.data;
                setcatalogs(Array.isArray(list) ? list : []);
            } catch {
                if (!cancelled) setcatalogs([]);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <CatalogCard data={catalogs} />
    );
}
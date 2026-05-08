import Button from "../../components/ui/Button";
import CatalogModal from "../../components/catalog/CatalogModal";
import { useState } from "react";

export default function Catalog() {
    const [show, setshow] = useState(false);


    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                <h1 className="text-amber-600 font-bold text-2xl">Catalogue</h1>
                <Button className="px-2" onClick={() => setshow(true)}>
                    {"Ajouter"}
                </Button>
            </div>
            <div className="flex-1">
                <CatalogModal visibility={show} onClose={() => setshow(false)} />
            </div>
        </div>
    );
}
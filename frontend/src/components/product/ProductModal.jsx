import Input from '../ui/Input';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { fieldClass } from '../../utils/formClasses';
import { useProductForm } from '../../hooks/useProductForm';
import ProductImagePicker from './ProductImagePicker';
import { X, Save, PlusCircle, Plus } from 'lucide-react';
import subCatalogService from '../../services/subCatalog';
import { useState, useEffect } from 'react';

export default function ProductModal({ visibility, onClose, catalogId, item = null }) {
    const form = useProductForm({ catalogId, item, onClose });
    const {
        isEditing,
        name,
        setName,
        price,
        setPrice,
        quantity,
        setQuantity,
        description,
        setDescription,
        subCatalogs,
        setSubCatalogs,
        images,
        setImages,
        error,
        setError,
        loading,
        submit,
    } = form;

    const [availableSubCatalogs, setAvailableSubCatalogs] = useState([]);
    const [addingSubCatalog, setAddingSubCatalog] = useState(false);
    const [newSubCatalogName, setNewSubCatalogName] = useState('');

    useEffect(() => {
        if (visibility && catalogId) {
            subCatalogService.getByCatalog(catalogId)
                .then(setAvailableSubCatalogs)
                .catch(console.error);
        }
    }, [visibility, catalogId]);

    const handleAddSubCatalog = async () => {
        if (!newSubCatalogName.trim()) return;
        try {
            const added = await subCatalogService.add(catalogId, { name: newSubCatalogName });
            setAvailableSubCatalogs((prev) => [...prev, added].sort((a, b) => a.name.localeCompare(b.name)));
            setSubCatalogs((prev) => [...prev, added.id]);
            setNewSubCatalogName('');
            setAddingSubCatalog(false);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleSubCatalog = (id) => {
        setSubCatalogs((prev) =>
            prev.includes(id) ? prev.filter((val) => val !== id) : [...prev, id]
        );
    };

    const footer = (
        <>
            <Button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full rounded-xl border border-slate-200 bg-white! py-2.5 font-semibold text-slate-700! shadow-sm hover:bg-slate-50! focus-visible:ring-slate-400 sm:w-auto sm:min-w-28"
            >
                <X className="h-5 w-5" /> Annuler
            </Button>
            <Button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 font-semibold sm:w-auto sm:min-w-36"
            >
                {loading ? (
                    <span className="flex items-center gap-2"><PlusCircle className="h-5 w-5 animate-pulse" /> Ajout…</span>
                ) : isEditing ? (
                    <><Save className="h-5 w-5" /> Enregistrer</>
                ) : (
                    <><PlusCircle className="h-5 w-5" /> Ajouter</>
                )}
            </Button>
        </>
    );

    return (
        <Modal
            open={visibility}
            onClose={onClose}
            titleId="product-modal-title"
            title={isEditing ? 'Modifier le produit' : 'Nouveau produit'}
            subtitle={
                isEditing
                    ? 'Mettez à jour les informations du produit.'
                    : 'Ajoutez les détails et jusqu’à 5 photos (jpeg, webp).'
            }
            error={error}
            asForm
            onSubmit={submit}
            scrollable
            footer={footer}
        >
            <div className="space-y-6 px-6 py-6 [&_label]:text-sm [&_label]:font-medium [&_label]:text-slate-700">
                <Input
                    id="prod_name"
                    label="Nom du produit"
                    placeholder="Ex. Casque Bluetooth"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={fieldClass}
                />
                <Input
                    id="prod_price"
                    label="Prix (DH)"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Ex. 299.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={fieldClass}
                />
                <Input
                    id="prod_qty"
                    label="Quantité en stock"
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className={fieldClass}
                />
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-slate-700">Sous-catégories</label>
                    <div className="flex flex-wrap gap-2">
                        {availableSubCatalogs.map((sc) => (
                            <label key={sc.id} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={subCatalogs.includes(sc.id)}
                                    onChange={() => toggleSubCatalog(sc.id)}
                                    className="accent-amber-600 rounded"
                                />
                                {sc.name}
                            </label>
                        ))}
                    </div>
                    {addingSubCatalog ? (
                        <div className="flex items-center gap-2 mt-2">
                            <Input
                                id="new_sc_name"
                                placeholder="Nom de la sous-catégorie"
                                value={newSubCatalogName}
                                onChange={(e) => setNewSubCatalogName(e.target.value)}
                                className={`${fieldClass} !py-1.5`}
                            />
                            <Button type="button" onClick={handleAddSubCatalog} className="!py-1.5 !px-3 shrink-0">Ajouter</Button>
                            <Button type="button" onClick={() => setAddingSubCatalog(false)} className="!py-1.5 !px-2 bg-slate-100 !text-slate-600 hover:bg-slate-200 shadow-none shrink-0"><X className="h-4 w-4" /></Button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setAddingSubCatalog(true)}
                            className="text-sm text-amber-600 font-medium hover:text-amber-700 flex items-center gap-1 self-start mt-1"
                        >
                            <Plus className="h-4 w-4" /> Ajouter une sous-catégorie
                        </button>
                    )}
                </div>
                <ProductImagePicker
                    images={images}
                    onChange={setImages}
                    onError={setError}
                    error={error && error.startsWith('Maximum') ? error : ''}
                />
                <div className="flex flex-col space-y-0.5">
                    <label htmlFor="prod_description" className="text-sm font-medium text-slate-700">
                        Description
                    </label>
                    <textarea
                        id="prod_description"
                        placeholder="Décrire le produit"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={fieldClass}
                    />
                </div>
            </div>
        </Modal>
    );
}

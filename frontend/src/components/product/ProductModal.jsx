import Input from '../ui/Input';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { fieldClass } from '../../utils/formClasses';
import { useProductForm } from '../../hooks/useProductForm';
import ProductImagePicker from './ProductImagePicker';

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
        images,
        setImages,
        error,
        setError,
        loading,
        submit,
    } = form;

    const footer = (
        <>
            <Button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 bg-white! py-2.5 font-semibold text-slate-700! shadow-sm hover:bg-slate-50! focus-visible:ring-slate-400 sm:w-auto sm:min-w-28"
            >
                Annuler
            </Button>
            <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-2.5 font-semibold sm:w-auto sm:min-w-36"
            >
                {loading ? 'Ajout…' : isEditing ? 'Enregistrer' : 'Ajouter'}
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

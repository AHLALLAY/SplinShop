import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import catalog from '../../services/catalog';
import { fieldClass, fieldClassFile } from '../../utils/formClasses';
import { slugify } from '../../utils/slug';
import { formatApiError } from '../../utils/formatApiError';

export default function CatalogModal({ visibility, onClose, item = null }) {
    const isEdit = Boolean(item?.id);
    const [name, setName] = useState(item?.name ?? '');
    const [description, setDescription] = useState(item?.description ?? '');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            const payload = {
                name,
                slug: slugify(name),
                description,
                image,
            };

            if (isEdit) {
                await catalog.updateCatalog(item.id, payload);
            } else {
                await catalog.addCatalog(payload);
            }

            setName('');
            setDescription('');
            setImage(null);
            setLoading(false);
            onClose();
        } catch (err) {
            setLoading(false);
            setError(formatApiError(err));
        }
    };

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
                {isEdit ? 'Enregistrer' : 'Ajouter'}
            </Button>
        </>
    );

    return (
        <Modal
            open={visibility}
            onClose={onClose}
            titleId="catalog-modal-title"
            title={isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            subtitle={
                isEdit
                    ? 'Mettez à jour le nom, la description ou l’image.'
                    : 'Ajoutez un nom et une image pour organiser votre catalogue.'
            }
            error={error}
            asForm
            onSubmit={handleSubmit}
            footer={footer}
        >
            <div className="space-y-6 px-6 py-6 [&_label]:text-sm [&_label]:font-medium [&_label]:text-slate-700">
                <Input
                    id="cat_name"
                    label="Nom de la catégorie"
                    placeholder="Ex. Électronique"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={fieldClass}
                />
                <div className="flex flex-col space-y-0.5">
                    <label htmlFor="cat_pic" className="text-sm font-medium text-slate-700">
                        {isEdit ? 'Remplacer la photo (optionnel)' : 'Choisir une photo'}
                    </label>
                    {isEdit && item?.imgUrl && !image && (
                        <p className="text-xs text-slate-500">
                            Image actuelle conservée si vous ne choisissez pas de fichier.
                        </p>
                    )}
                    <input
                        id="cat_pic"
                        type="file"
                        accept="image/jpeg,image/webp"
                        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                        className={fieldClassFile}
                        required={false}
                    />
                </div>
                <div className="flex flex-col space-y-0.5">
                    <label htmlFor="cat_description" className="text-sm font-medium text-slate-700">
                        Description
                    </label>
                    <textarea
                        id="cat_description"
                        placeholder="Décrire la catégorie"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={fieldClass}
                    />
                </div>
            </div>
        </Modal>
    );
}

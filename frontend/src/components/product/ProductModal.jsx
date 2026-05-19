import { useEffect, useMemo, useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import product from "../../services/product";

const fieldClass =
    "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/25 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-amber-800 hover:file:bg-amber-100";

const MAX_IMAGES = 5;

function fileKey(file) {
    return `${file.name}-${file.size}-${file.lastModified}`;
}

function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}

function formatApiError(err) {
    const fieldErrors = err.data?.fieldErrors;
    if (fieldErrors) {
        return Object.entries(fieldErrors)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
            .join(" · ");
    }
    return err.message || "Erreur lors de l'ajout.";
}

export default function ProductModal({ visibility, onClose, catalogId, item = null }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const isEdit = Boolean(item?.id);

    useEffect(() => {
        if (!visibility) return;
        setError("");
        setImages([]);
        if (item) {
            setName(item.name ?? "");
            setPrice(item.price != null ? String(item.price) : "");
            setQuantity(item.quantity != null ? String(item.quantity) : "1");
            setDescription(item.description ?? "");
        } else {
            setName("");
            setPrice("");
            setQuantity("1");
            setDescription("");
        }
    }, [visibility, item]);

    const previewItems = useMemo(
        () =>
            images.map((file, index) => ({
                key: `${fileKey(file)}-${index}`,
                url: URL.createObjectURL(file),
            })),
        [images]
    );

    useEffect(() => {
        return () => previewItems.forEach((item) => URL.revokeObjectURL(item.url));
    }, [previewItems]);

    const handleFilesChange = (e) => {
        const picked = Array.from(e.target.files ?? []);
        e.target.value = "";

        if (picked.length === 0) return;

        setImages((prev) => {
            const seen = new Set(prev.map(fileKey));
            const merged = [...prev];
            for (const file of picked) {
                const key = fileKey(file);
                if (!seen.has(key)) {
                    seen.add(key);
                    merged.push(file);
                }
            }
            if (merged.length > MAX_IMAGES) {
                setError(`Maximum ${MAX_IMAGES} images (jpeg, webp).`);
                return merged.slice(0, MAX_IMAGES);
            }
            setError("");
            return merged;
        });
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmition = async (e) => {
        e.preventDefault();
        if (isEdit) {
            setError("La modification sera disponible lorsque l'API sera en place.");
            return;
        }
        if (!catalogId) {
            setError("Catégorie introuvable.");
            return;
        }

        const priceNum = Number(price);
        const qtyNum = Number(quantity);
        if (!name.trim()) {
            setError("Le nom est requis.");
            return;
        }
        if (!Number.isFinite(priceNum) || priceNum <= 0) {
            setError("Le prix doit être un nombre positif.");
            return;
        }
        if (!Number.isInteger(qtyNum) || qtyNum < 1) {
            setError("La quantité doit être au moins 1.");
            return;
        }

        try {
            setError("");
            setLoading(true);
            await product.addProduct({
                catalogId,
                name: name.trim(),
                price: priceNum,
                quantity: qtyNum,
                slug: slugify(name),
                description: description.trim() || undefined,
                images,
            });
            setName("");
            setPrice("");
            setQuantity("1");
            setDescription("");
            setImages([]);
            setLoading(false);
            onClose();
        } catch (err) {
            setLoading(false);
            setError(formatApiError(err));
        }
    };

    if (!visibility) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
        >
            <button
                type="button"
                className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px] transition-opacity"
                aria-label="Fermer la fenêtre"
                onClick={onClose}
            />

            <form
                onSubmit={handleSubmition}
                className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-300/40"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="border-b border-slate-100 bg-linear-to-r from-amber-50/80 to-white px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2
                                id="product-modal-title"
                                className="text-xl font-semibold tracking-tight text-slate-900"
                            >
                                {isEdit ? "Modifier le produit" : "Nouveau produit"}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {isEdit
                                    ? "Mettez à jour les informations du produit."
                                    : "Ajoutez les détails et jusqu'à 5 photos (jpeg, webp)."}
                            </p>
                            {error && (
                                <p className="mt-2 text-sm text-red-600 bg-red-300/30 rounded-lg px-4 py-1">
                                    {error}
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Fermer"
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl leading-none text-slate-400 transition hover:bg-white hover:text-slate-700 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                        >
                            &times;
                        </button>
                    </div>
                </div>

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
                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="prod_pics" className="text-sm font-medium text-slate-700">
                            Photos du produit
                        </label>
                        <input
                            id="prod_pics"
                            type="file"
                            accept="image/jpeg,image/webp"
                            multiple
                            disabled={images.length >= MAX_IMAGES}
                            onChange={handleFilesChange}
                            className={`${fieldClass} cursor-pointer text-sm text-slate-600 file:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`}
                        />
                        <p className="text-xs text-slate-500">
                            {images.length}/{MAX_IMAGES} image{images.length !== 1 ? "s" : ""} — la
                            première est principale. Ajoutez-en plusieurs fois si besoin.
                        </p>
                        {previewItems.length > 0 && (
                            <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-5">
                                {previewItems.map((item, i) => (
                                    <div
                                        key={item.key}
                                        className="relative aspect-square overflow-hidden rounded-lg ring-1 ring-amber-200"
                                    >
                                        <img
                                            src={item.url}
                                            alt={`Aperçu ${i + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                        {i === 0 && (
                                            <span className="absolute left-1 top-1 rounded bg-amber-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                                Principale
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            aria-label="Retirer l'image"
                                            onClick={() => removeImage(i)}
                                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-xs text-white hover:bg-slate-900"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
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

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:flex-row sm:justify-end">
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
                        {loading ? "Ajout…" : isEdit ? "Enregistrer" : "Ajouter"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

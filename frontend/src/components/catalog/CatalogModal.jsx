import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

const fieldClass =
    "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/25 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-amber-800 hover:file:bg-amber-100";

export default function CatalogModal({ visibility, onClose }) {
    const [name, setName] = useState("");
    const [pic, setPic] = useState(null);

    const handleSubmition = (e) => {
        e.preventDefault();
    };

    if (!visibility) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="catalog-modal-title"
        >
            <button
                type="button"
                className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px] transition-opacity"
                aria-label="Fermer la fenêtre"
                onClick={onClose}
            />

            <form
                onSubmit={handleSubmition}
                className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-300/40"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="border-b border-slate-100 bg-linear-to-r from-amber-50/80 to-white px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2
                                id="catalog-modal-title"
                                className="text-xl font-semibold tracking-tight text-slate-900"
                            >
                                Nouvelle catégorie
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Ajoutez un nom et une image pour organiser votre catalogue.
                            </p>
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
                        id="cat_name"
                        label="Nom de la catégorie"
                        placeholder="Ex. Électronique"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={fieldClass}
                    />
                    <div className="flex flex-col space-y-0.5">
                        <label htmlFor="cat_pic" className="text-sm font-medium text-slate-700">
                            Choisir une photo
                        </label>
                        <input
                            id="cat_pic"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setPic(e.target.files?.[0] ?? null)}
                            className={`${fieldClass} cursor-pointer text-sm text-slate-600 file:cursor-pointer`}
                        />
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-xl border border-slate-200 bg-white! py-2.5 font-semibold text-slate-700! shadow-sm hover:bg-slate-50! focus-visible:ring-slate-400 sm:w-auto sm:min-w-28"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        className="w-full rounded-xl py-2.5 font-semibold sm:w-auto sm:min-w-36"
                    >
                        Ajouter
                    </Button>
                </div>
            </form>
        </div>
    );
}

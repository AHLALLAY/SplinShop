import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import ImagePlaceholder from "../ui/ImagePlaceholder.jsx";

const kebabBtnClass =
    "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 p-0 text-stone-700 shadow-md ring-1 ring-amber-200/80 backdrop-blur-sm transition hover:bg-white hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 active:scale-100";
const menuItemClass =
    "block w-full rounded-none border-0 bg-transparent px-4 py-2 text-left text-sm font-medium shadow-none transition hover:scale-100 active:scale-100";

function CatalogItemCard({ item, adminMode, onEdit, onDelete }) {
    const [imgFailed, setImgFailed] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const rawSrc = item.imgUrl || item.image || "";
    const showPhoto = Boolean(rawSrc?.trim()) && !imgFailed;

    useEffect(() => {
        if (!menuOpen) return;
        const close = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [menuOpen]);

    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border border-amber-200/70 bg-white shadow-sm shadow-amber-950/5 transition hover:border-amber-300 hover:shadow-md hover:shadow-amber-950/10">
            <div className="relative aspect-4/3 w-full overflow-hidden bg-linear-to-br from-amber-50 via-stone-50 to-amber-100/80">
                {adminMode && (
                    <div ref={menuRef} className="absolute right-2 top-2 z-10">
                        <button
                            type="button"
                            aria-label="Actions sur la catégorie"
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen((o) => !o);
                            }}
                            className={kebabBtnClass}
                        >
                            <MoreVertical className="h-5 w-5" aria-hidden />
                        </button>
                        {menuOpen && (
                            <div
                                role="menu"
                                className="absolute right-0 top-full mt-1 min-w-[9.5rem] overflow-hidden rounded-xl border border-amber-200/80 bg-white py-1 shadow-lg shadow-amber-950/10"
                            >
                                <button
                                    type="button"
                                    role="menuitem"
                                    className={`${menuItemClass} text-stone-700 hover:bg-amber-50`}
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onEdit?.(item);
                                    }}
                                >
                                    Modifier
                                </button>
                                <button
                                    type="button"
                                    role="menuitem"
                                    className={`${menuItemClass} text-red-600 hover:bg-red-50`}
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onDelete?.(item);
                                    }}
                                >
                                    Supprimer
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {showPhoto ? (
                    <img
                        src={rawSrc}
                        alt={item.name || "Catalogue"}
                        loading="lazy"
                        decoding="async"
                        onError={() => setImgFailed(true)}
                        className="h-full w-full object-cover transition duration-300 ease-out group-hover:scale-[1.03]"
                    />
                ) : (
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-amber-500"
                        role="img"
                        aria-label="Aucune image"
                    >
                        <ImagePlaceholder className="h-20 w-20 shrink-0" />
                        <span className="text-xs font-medium text-amber-800/55">
                            Pas d&apos;image
                        </span>
                    </div>
                )}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-4">
                <h2 className="line-clamp-2 text-lg font-semibold tracking-tight text-stone-900">
                    {item.name}
                </h2>
                {item.description ? (
                    <p className="mt-0.5 line-clamp-3 text-sm leading-relaxed text-stone-600">
                        {item.description}
                    </p>
                ) : null}
            </div>
        </article>
    );
}

export default function CatalogCard({ data = [], adminMode = false, onEdit, onDelete }) {
    const list = Array.isArray(data) ? data : [];

    if (list.length === 0) {
        return (
            <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 px-6 py-16 text-center">
                <ImagePlaceholder className="h-24 w-24 text-amber-400" />
                <p className="mt-4 max-w-sm text-sm text-stone-600">
                    Aucun catalogue pour le moment.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((item, index) => (
                <CatalogItemCard
                    key={item.id ?? index}
                    item={item}
                    adminMode={adminMode}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

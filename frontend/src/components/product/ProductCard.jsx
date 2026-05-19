import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, MoreVertical } from "lucide-react";
import ImagePlaceholder from "../ui/ImagePlaceholder.jsx";
import Button from "../ui/Button.jsx";

const kebabBtnClass =
    "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 p-0 text-stone-700 shadow-md ring-1 ring-amber-200/80 backdrop-blur-sm transition hover:bg-white hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1";
const menuItemClass =
    "block w-full rounded-none border-0 bg-transparent px-4 py-2 text-left text-sm font-medium shadow-none transition hover:bg-amber-50";

function normalizeImages(item) {
    const raw = item?.images;
    if (!Array.isArray(raw) || raw.length === 0) return [];
    return [...raw]
        .filter((img) => img?.imgUrl?.trim())
        .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
}

function formatPrice(price) {
    return Number(price).toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function ProductGallery({ images, productName = "" }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [mainFailed, setMainFailed] = useState(false);
    const [failedThumbs, setFailedThumbs] = useState(() => new Set());

    useEffect(() => {
        setActiveIndex(0);
        setMainFailed(false);
        setFailedThumbs(new Set());
    }, [images]);

    const safeIndex = images.length ? Math.min(activeIndex, images.length - 1) : 0;
    const current = images[safeIndex];
    const mainSrc = current?.imgUrl;
    const showMain = Boolean(mainSrc) && !mainFailed;

    const goPrev = () => setActiveIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
    const goNext = () => setActiveIndex((i) => (i >= images.length - 1 ? 0 : i + 1));

    const selectImage = (i) => {
        setActiveIndex(i);
        setMainFailed(false);
    };

    return (
        <div className="flex min-h-0 flex-col border-b border-amber-100/80 bg-linear-to-br from-amber-50/60 via-stone-50 to-white lg:w-[46%] lg:border-b-0 lg:border-r">
            <div className="relative min-h-[220px] flex-1 sm:min-h-[260px] lg:min-h-[300px]">
                {showMain ? (
                    <img
                        src={mainSrc}
                        alt={productName || "Produit"}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={() => setMainFailed(true)}
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-amber-500">
                        <ImagePlaceholder className="h-24 w-24" />
                        <span className="text-xs font-medium text-amber-800/55">Pas d&apos;image</span>
                    </div>
                )}

                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            aria-label="Image précédente"
                            onClick={goPrev}
                            className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-md ring-1 ring-amber-200/80 transition hover:bg-white"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            aria-label="Image suivante"
                            onClick={goNext}
                            className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-md ring-1 ring-amber-200/80 transition hover:bg-white"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                            {images.map((img, i) => (
                                <button
                                    key={img.id ?? i}
                                    type="button"
                                    aria-label={`Image ${i + 1}`}
                                    onClick={() => selectImage(i)}
                                    className={`h-1.5 rounded-full transition-all ${
                                        i === safeIndex
                                            ? "w-6 bg-amber-600"
                                            : "w-1.5 bg-white/80 hover:bg-white"
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 border-t border-amber-100/80 bg-white/80 p-3 sm:grid-cols-5">
                    {images.map((img, i) => {
                        const thumbFailed = failedThumbs.has(i);
                        const isActive = i === safeIndex;
                        return (
                            <button
                                key={img.id ?? i}
                                type="button"
                                aria-label={`Voir l'image ${i + 1}`}
                                onClick={() => selectImage(i)}
                                className={`relative aspect-square overflow-hidden rounded-lg ring-2 transition ${
                                    isActive
                                        ? "ring-amber-500 ring-offset-1"
                                        : "ring-transparent hover:ring-amber-200"
                                }`}
                            >
                                {!thumbFailed ? (
                                    <img
                                        src={img.imgUrl}
                                        alt=""
                                        className="h-full w-full object-cover"
                                        onError={() =>
                                            setFailedThumbs((prev) => new Set(prev).add(i))
                                        }
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-amber-50">
                                        <ImagePlaceholder className="h-8 w-8" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function ProductItemCard({ item, adminMode, onEdit, onDelete }) {
    const images = useMemo(() => normalizeImages(item), [item]);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return;
        const close = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [menuOpen]);

    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border border-amber-200/70 bg-white shadow-sm shadow-amber-950/5 transition hover:border-amber-300 hover:shadow-md lg:flex-row">
            <ProductGallery images={images} productName={item.name} />

            <div className="relative flex flex-1 flex-col gap-3 p-5 lg:w-[54%] lg:p-6">
                {adminMode && (
                    <div ref={menuRef} className="absolute right-4 top-4 z-10">
                        <button
                            type="button"
                            aria-label="Actions sur le produit"
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((o) => !o)}
                            className={kebabBtnClass}
                        >
                            <MoreVertical className="h-5 w-5" aria-hidden />
                        </button>
                        {menuOpen && (
                            <div
                                role="menu"
                                className="absolute right-0 top-full mt-1 min-w-38 overflow-hidden rounded-xl border border-amber-200/80 bg-white py-1 shadow-lg"
                            >
                                <button
                                    type="button"
                                    role="menuitem"
                                    className={`${menuItemClass} text-stone-700`}
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

                <div className={adminMode ? "pr-10" : ""}>
                    <h2 className="text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">
                        {item.name}
                    </h2>
                    <p className="mt-1 text-lg font-semibold text-amber-700">
                        {formatPrice(item.price)} DH
                    </p>
                </div>

                {item.description ? (
                    <p className="flex-1 text-sm leading-relaxed text-stone-600 sm:text-base">
                        {item.description}
                    </p>
                ) : (
                    <p className="flex-1 text-sm italic text-stone-400">Aucune description.</p>
                )}

                {!adminMode && (
                    <Button
                        type="button"
                        className="mt-2 flex w-full items-center justify-center gap-2 bg-[#25D366]! py-3 shadow-md shadow-[#25D366]/25 hover:bg-[#20bd5a]! sm:w-auto sm:min-w-[240px]"
                        onClick={() => {
                            /* logique WhatsApp à brancher */
                        }}
                    >
                        <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
                        Commander sur WhatsApp
                    </Button>
                )}
            </div>
        </article>
    );
}

export default function ProductCard({
    data = [],
    adminMode = false,
    onEdit,
    onDelete,
}) {
    const list = Array.isArray(data) ? data : [];

    if (list.length === 0) {
        return (
            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 px-6 py-12 text-center">
                <ImagePlaceholder className="h-20 w-20 text-amber-400" />
                <p className="mt-4 max-w-sm text-sm text-stone-600">
                    Aucun produit dans cette catégorie pour le moment.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-6 flex flex-col gap-6">
            {list.map((item, index) => (
                <ProductItemCard
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

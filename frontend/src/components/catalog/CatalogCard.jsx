import { useState } from "react";
import ImagePlaceholder from "../ui/ImagePlaceholder.jsx";

function CatalogItemCard({ item }) {
    const [imgFailed, setImgFailed] = useState(false);
    const rawSrc = item.imgUrl || item.image || "";
    const showPhoto = Boolean(rawSrc?.trim()) && !imgFailed;

    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border border-amber-200/70 bg-white shadow-sm shadow-amber-950/5 transition hover:border-amber-300 hover:shadow-md hover:shadow-amber-950/10">
            <div className="relative aspect-4/3 w-full overflow-hidden bg-linear-to-br from-amber-50 via-stone-50 to-amber-100/80">
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

export default function CatalogCard({ data = [] }) {
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
                <CatalogItemCard key={item.id ?? index} item={item} />
            ))}
        </div>
    );
}

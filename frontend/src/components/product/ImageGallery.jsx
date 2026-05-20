import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ImagePlaceholder from '../ui/ImagePlaceholder';

export default function ImageGallery({ images, productName = '' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mainFailed, setMainFailed] = useState(false);
  const [failedThumbs, setFailedThumbs] = useState(() => new Set());

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
            alt={productName || 'Produit'}
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
                  className={`h-1.5 rounded-full transition-all ${i === safeIndex ? 'w-6 bg-amber-600' : 'w-1.5 bg-white/80 hover:bg-white'
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
                className={`relative aspect-square overflow-hidden rounded-lg ring-2 transition ${isActive
                  ? 'ring-amber-500 ring-offset-1'
                  : 'ring-transparent hover:ring-amber-200'
                  }`}
              >
                {!thumbFailed ? (
                  <img
                    src={img.imgUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={() => setFailedThumbs((prev) => new Set(prev).add(i))}
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

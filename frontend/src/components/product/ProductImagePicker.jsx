import { useEffect, useMemo } from 'react';
import { fieldClassFileDisabled } from '../../utils/formClasses';
import { MAX_PRODUCT_IMAGES, fileKey } from '../../utils/productImages';

export default function ProductImagePicker({ images, onChange, onError, error }) {
  const previewItems = useMemo(
    () =>
      images.map((file, index) => ({
        key: `${fileKey(file)}-${index}`,
        url: URL.createObjectURL(file),
      })),
    [images],
  );

  useEffect(() => {
    return () => previewItems.forEach((item) => URL.revokeObjectURL(item.url));
  }, [previewItems]);

  const handleFilesChange = (e) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (picked.length === 0) return;

    onChange((prev) => {
      const seen = new Set(prev.map(fileKey));
      const merged = [...prev];
      for (const file of picked) {
        const key = fileKey(file);
        if (!seen.has(key)) {
          seen.add(key);
          merged.push(file);
        }
      }
      if (merged.length > MAX_PRODUCT_IMAGES) {
        onError(`Maximum ${MAX_PRODUCT_IMAGES} images (jpeg, webp).`);
        return merged.slice(0, MAX_PRODUCT_IMAGES);
      }
      onError('');
      return merged;
    });
  };

  const removeImage = (index) => {
    onChange((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <label htmlFor="prod_pics" className="text-sm font-medium text-slate-700">
        Photos du produit
      </label>
      <input
        id="prod_pics"
        type="file"
        accept="image/jpeg,image/webp"
        multiple
        disabled={images.length >= MAX_PRODUCT_IMAGES}
        onChange={handleFilesChange}
        className={fieldClassFileDisabled}
      />
      <p className="text-xs text-slate-500">
        {images.length}/{MAX_PRODUCT_IMAGES} image{images.length !== 1 ? 's' : ''} — la première est
        principale. Ajoutez-en plusieurs fois si besoin.
      </p>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {previewItems.length > 0 && (
        <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {previewItems.map((item, i) => (
            <div
              key={item.key}
              className="relative aspect-square overflow-hidden rounded-lg ring-1 ring-amber-200"
            >
              <img src={item.url} alt={`Aperçu ${i + 1}`} className="h-full w-full object-cover" />
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
  );
}

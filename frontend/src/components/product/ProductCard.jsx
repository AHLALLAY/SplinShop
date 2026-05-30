import { useMemo, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ImagePlaceholder from '../ui/ImagePlaceholder';
import Button from '../ui/Button';
import KebabMenu from '../ui/KebabMenu';
import ImageGallery from './ImageGallery';

function normalizeImages(item) {
  const raw = item?.images;
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return [...raw]
    .filter((img) => img?.imgUrl?.trim())
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
}

function formatPrice(price) {
  return Number(price).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function galleryKeyFromImages(images) {
  return images.map((img, i) => img.id ?? img.imgUrl ?? i).join('|');
}

function ProductItemCard({ item, adminMode, onEdit, onHide, onDelete }) {
  const images = useMemo(() => normalizeImages(item), [item]);
  const galleryKey = galleryKeyFromImages(images);
  const [msg, setMsg] = useState('');

  const handleWhatsAppOrder = () => {
    setMsg('cette fonctionnalité n\'est pas encore implémenter.');
    return;
    // TODO(whatsapp): brancher lien WhatsApp pour les clients connectés
  };

  const kebabItems = [
    {
      label: 'Modifier',
      className: 'text-stone-700',
      onClick: () => onEdit?.(item),
    },
    {
      label: item.isHidden ? 'Afficher' : 'Masquer',
      className: item.isHidden
        ? 'text-emerald-700 hover:bg-emerald-50'
        : 'text-yellow-600 hover:bg-yellow-50',
      onClick: () => onHide?.(item),
    },
    {
      label: 'Supprimer',
      className: 'text-red-600 hover:bg-red-50',
      onClick: () => onDelete?.(item),
    },
  ];

  return (
    <article className={`group relative flex flex-col h-full overflow-hidden rounded-2xl border bg-white shadow-sm shadow-amber-950/5 transition hover:shadow-md ${
      adminMode && item.isHidden
        ? 'opacity-65 border-dashed border-amber-300 bg-amber-50/10'
        : 'border-amber-200/70 hover:border-amber-300'
    }`}>
      {adminMode && (
        <KebabMenu
          ariaLabel="Actions sur le produit"
          items={kebabItems}
          className="absolute right-3 top-3 z-30"
          stopPropagation
        />
      )}

      <ImageGallery key={galleryKey} images={images} productName={item.name} />

      <div className="relative flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <h2 className="text-lg font-semibold tracking-tight text-stone-900 sm:text-xl">
              {item.name}
            </h2>
            {adminMode && item.isHidden && (
              <span className="inline-flex items-center rounded-md bg-yellow-50 px-1.5 py-0.5 text-[10px] font-semibold text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                Masqué
              </span>
            )}
          </div>
          <p className="mt-1 text-md font-semibold text-amber-700">{formatPrice(item.price)} DH</p>
        </div>

        {item.description ? (
          <p className="flex-1 text-sm leading-relaxed text-stone-600">
            {item.description}
          </p>
        ) : (
          <p className="flex-1 text-sm italic text-stone-400">Aucune description.</p>
        )}

        {!adminMode && (
          <div className="flex flex-col gap-2 mt-auto">
            <Button
              type="button"
              className="mt-2 flex w-full items-center justify-center gap-2 bg-[#25D366]! py-3 shadow-md shadow-[#25D366]/25 hover:bg-[#20bd5a]!"
              onClick={handleWhatsAppOrder}
              title="Commander via WhatsApp"
            >
              <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
              Commander sur WhatsApp
            </Button>
            {msg && (
              <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 ring-1 ring-amber-200">
                {msg}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function ProductCard({ data = [], adminMode = false, onEdit, onHide, onDelete }) {
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
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((item, index) => (
        <ProductItemCard
          key={item.id ?? index}
          item={item}
          adminMode={adminMode}
          onEdit={onEdit}
          onHide={onHide}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

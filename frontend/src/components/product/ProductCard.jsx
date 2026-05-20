import { useMemo } from 'react';
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

function ProductItemCard({ item, adminMode, onEdit, onDelete }) {
  const images = useMemo(() => normalizeImages(item), [item]);
  const galleryKey = galleryKeyFromImages(images);

  const kebabItems = [
    {
      label: 'Modifier',
      className: 'text-stone-700',
      onClick: () => onEdit?.(item),
    },
    {
      label: 'Supprimer',
      className: 'text-red-600 hover:bg-red-50',
      onClick: () => onDelete?.(item),
    },
  ];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-amber-200/70 bg-white shadow-sm shadow-amber-950/5 transition hover:border-amber-300 hover:shadow-md lg:flex-row">
      <ImageGallery key={galleryKey} images={images} productName={item.name} />

      <div className="relative flex flex-1 flex-col gap-3 p-5 lg:w-[54%] lg:p-6">
        {adminMode && <KebabMenu ariaLabel="Actions sur le produit" items={kebabItems} />}

        <div className={adminMode ? 'pr-10' : ''}>
          <h2 className="text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">
            {item.name}
          </h2>
          <p className="mt-1 text-lg font-semibold text-amber-700">{formatPrice(item.price)} DH</p>
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
              // TODO(whatsapp): brancher lien WhatsApp
            }}
            title="TODO(whatsapp): commander via WhatsApp"
          >
            <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
            Commander sur WhatsApp
          </Button>
        )}
      </div>
    </article>
  );
}

export default function ProductCard({ data = [], adminMode = false, onEdit, onDelete }) {
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

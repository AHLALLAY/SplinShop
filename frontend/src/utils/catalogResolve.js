import { slugify } from './slug';

/**
 * Slug catalogue pour navigation (priorité au slug API, sinon dérivé du nom).
 */
export function resolveCatalogSlug(item) {
  if (item?.slug?.trim()) return item.slug.trim();
  if (item?.name?.trim()) return slugify(item.name);
  return '';
}

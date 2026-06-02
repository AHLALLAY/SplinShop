import { resolveCatalogSlug } from './catalogResolve';

/**
 * Navigue vers la liste produits d’un catalogue (vitrine ou admin).
 * @param {import('react-router-dom').NavigateFunction} navigate
 * @param {object} catalog - Objet catalogue (id, slug, name)
 * @param {{ admin?: boolean }} [options]
 */
export function navigateToCatalogProducts(navigate, catalog, options = {}) {
    const slug = resolveCatalogSlug(catalog);
    if (!slug) return;
    const encoded = encodeURIComponent(slug);
    const path = options.admin
        ? `/admin/catalog/${encoded}/products`
        : `/catalog/${encoded}/products`;
    navigate(path);
}

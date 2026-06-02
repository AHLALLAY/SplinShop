/**
 * Filtre les produits par nom, description ou slug (insensible à la casse).
 * @param {Array<{ name?: string, description?: string, slug?: string }>} products
 * @param {string} query
 */
export function filterProductsByQuery(products, query) {
  const list = Array.isArray(products) ? products : [];
  const q = String(query ?? '').trim().toLowerCase();
  if (!q) return list;

  return list.filter((item) => {
    const name = item?.name?.toLowerCase() ?? '';
    const description = item?.description?.toLowerCase() ?? '';
    const slug = item?.slug?.toLowerCase() ?? '';
    return name.includes(q) || description.includes(q) || slug.includes(q);
  });
}

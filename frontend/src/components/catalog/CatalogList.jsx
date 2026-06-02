export default function CatalogsList({ list = [] }) {
    if (!list || list.length === 0) {
        return (
            <div className="p-8 text-center text-stone-500 bg-white rounded-2xl border border-amber-200 shadow-sm">
                Aucun catalogue à afficher.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-2xl border border-amber-200 shadow-sm">
            <table className="min-w-full text-left text-sm whitespace-nowrap text-stone-700">
                <thead className="tracking-wider border-b border-amber-200 bg-amber-50">
                    <tr>
                        <th className="px-6 py-4 font-semibold uppercase text-stone-800">Nom du Catalogue</th>
                        <th className="px-6 py-4 font-semibold uppercase text-center text-stone-800">Nombre de Produits</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                    {list.map((catalog) => (
                        <tr key={catalog.id} className="hover:bg-amber-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-stone-900">
                                {catalog.name}
                            </td>
                            <td className="px-6 py-4 text-center">
                                {catalog._count?.products ?? '—'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
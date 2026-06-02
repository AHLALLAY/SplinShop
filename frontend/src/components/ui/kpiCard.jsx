// Composant interne pour structurer proprement chaque indicateur
const StatCard = ({ title, total, active = 0, inactive = 0, deleted = 0 }) => (
  <article className="flex flex-col rounded-2xl border border-[#fce78f] bg-[#fff8db] p-5 shadow-xs transition-all duration-200 hover:shadow-md text-[#45556c]">

    {/* Section Haute : Titre & Total alignés côte à côte */}
    <div className="flex items-center justify-between border-b border-[#fce78f]/70 pb-3 mb-4">
      <h2 className="text-sm font-bold tracking-wider uppercase text-[#45556c]/95">
        {title}
      </h2>
      <span className="text-2xl font-black text-orange-600 bg-white px-3 py-0.5 rounded-xl border border-[#fce78f]/50 shadow-2xs">
        {total}
      </span>
    </div>

    {/* Section Basse : Totaux par statut répartis horizontalement */}
    <div className="flex items-center justify-between gap-2 mt-auto">
      <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-orange-100 flex-1 justify-center shadow-2xs">
        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-tight">Actifs</span>
        <span className="text-xs font-bold text-emerald-600">{active}</span>
      </div>

      <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-orange-100 flex-1 justify-center shadow-2xs">
        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-tight">Masqués</span>
        <span className="text-xs font-bold text-orange-500">{inactive}</span>
      </div>

      <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-orange-100 flex-1 justify-center shadow-2xs">
        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-tight">Suppr.</span>
        <span className="text-xs font-bold text-red-500">{deleted}</span>
      </div>
    </div>

  </article>
);

export default function KpiCard({ kpi }) {
  if (!kpi) return null;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 w-full">
      <StatCard
        title="Catalogues"
        total={kpi["All Catalogs"] ?? 0}
        active={kpi["Displayed Catalogs"] ?? 0}
        inactive={kpi["Hidden Catalogs"] ?? 0}
        deleted={kpi["Deleted Catalogs"] ?? 0}
      />

      <StatCard
        title="Produits"
        total={kpi["All Products"] ?? 0}
        active={kpi["Displayed Products"] ?? 0}
        inactive={kpi["Hidden Products"] ?? 0}
        deleted={kpi["Deleted Products"] ?? 0}
      />
    </div>
  );
}
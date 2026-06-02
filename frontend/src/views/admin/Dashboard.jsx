import { useEffect, useState } from "react";
import kpiService from "../../services/kpi";
import KpiCard from "../../components/ui/kpiCard";
import CatalogsList from "../../components/catalog/CatalogList";

export default function AdminDashboard() {
  const [statistics, setStatistics] = useState(null);
  const { loading } = useCatalogs({ forAdmin: true }); // Plus besoin de 'catalogs' ici si on utilise statistics

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const allStatistics = await kpiService.getAll();
        setStatistics(allStatistics); 
      } catch (e) {
        console.error(e);
      }
    };
    fetchKPIs();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-amber-600 mb-4">KPIs</h1>
        <KpiCard kpi={statistics} />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-amber-600 mb-4">Liste des Catalogues</h1>
        {loading || !statistics ? (
            <p className="text-sm text-stone-500">Chargement des catalogues…</p>
        ) : (
            <CatalogsList list={statistics["All Products By Catalog"]} />
        )}
      </div>
    </div>
  );
}
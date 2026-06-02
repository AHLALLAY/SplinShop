import Button from '../ui/Button';
import { Pencil, Trash2, Lock, Unlock, Phone, Mail } from 'lucide-react';

export default function SellerCard({ sellers = [] }) {
  const getStatusMeta = (seller) => {
    if (seller.isDeleted) return { label: 'Supprimé', badgeClass: 'bg-red-100 text-red-900 ring-red-300' };
    if (seller.status === 'active' || seller.status === 'actif') return { label: 'Actif', badgeClass: 'bg-emerald-100 text-emerald-900 ring-emerald-300' };

    return { label: 'Suspendu', badgeClass: 'bg-amber-100 text-amber-900 ring-amber-300' };
  };

  const btnBaseClass = "flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed w-full";

  const btnVariants = {
    edit: "bg-slate-700 hover:bg-slate-800 text-white focus-visible:ring-slate-500 border-transparent",
    delete: "bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500 border-transparent",
    suspend: "bg-amber-500 hover:bg-amber-600 text-white focus-visible:ring-amber-500 border-transparent",
    activate: "bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-emerald-500 border-transparent",
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {sellers.map((seller) => {
        const statusMeta = getStatusMeta(seller);
        const isActive = seller.status === 'active' || seller.status === 'actif';

        return (
          <div
            key={seller.id ?? `${seller.email}-${seller.name}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md flex flex-col"
          >
            <div className="flex h-full flex-col gap-5">

              {/* En-tête de la carte */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-bold text-slate-900 line-clamp-2">{seller.name}</h2>
                  <span className={`inline-flex items-center shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${statusMeta.badgeClass}`}>
                    {statusMeta.label}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-slate-700 font-medium">
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 shrink-0 text-slate-500" />
                    <span className="truncate">{seller.phone || 'Numéro non défini'}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 shrink-0 text-slate-500" />
                    <span className="truncate">{seller.email}</span>
                  </p>
                </div>
              </div>

              {/* Zone des boutons */}
              <div className="mt-auto pt-5 border-t border-slate-200 grid grid-cols-3 gap-2">
                <Button className={`${btnBaseClass} ${btnVariants.edit}`} title="Éditer">
                  <Pencil className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline truncate">Éditer</span>
                </Button>

                <Button className={`${btnBaseClass} ${btnVariants.delete}`} title="Supprimer">
                  <Trash2 className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline truncate">Supprimer</span>
                </Button>

                <Button
                  className={`${btnBaseClass} ${isActive ? btnVariants.suspend : btnVariants.activate}`}
                  title={isActive ? 'Suspendre' : 'Activer'}
                >
                  {isActive ? (
                    <>
                      <Lock className="w-4 h-4 shrink-0" />
                      <span className="hidden lg:inline truncate">Suspendre</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 shrink-0" />
                      <span className="hidden lg:inline truncate">Activer</span>
                    </>
                  )}
                </Button>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}
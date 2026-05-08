import Button from "../ui/Button";

export default function SellerCard({ sellers = [] }) {
    const getStatusMeta = (seller) => {
        if (seller.isDeleted) {
            return {
                label: "Supprime",
                badgeClass: "bg-red-100 text-red-700 ring-red-200",
            };
        }

        if (seller.status === "active" || seller.status === "actif") {
            return {
                label: "Actif",
                badgeClass: "bg-emerald-100 text-emerald-700 ring-emerald-200",
            };
        }

        return {
            label: "Suspendu",
            badgeClass: "bg-amber-100 text-amber-700 ring-amber-200",
        };
    };

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sellers.map((seller) => {
                const statusMeta = getStatusMeta(seller);
                const isActive = seller.status === "active" || seller.status === "actif";

                return (
                    <div
                        key={seller.id ?? `${seller.email}-${seller.name}`}
                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div className="flex h-full flex-col gap-4">
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <h2 className="text-base font-semibold text-slate-800">
                                        {seller.name}
                                    </h2>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusMeta.badgeClass}`}
                                    >
                                        {statusMeta.label}
                                    </span>
                                </div>

                                <div className="space-y-1 text-sm text-slate-600">
                                    <p>{seller.phone || "Numero non defini"}</p>
                                    <p className="break-all">{seller.email}</p>
                                </div>
                            </div>

                            <div className="mt-auto grid grid-cols-1 gap-2 sm:grid-cols-3">
                                <Button className="bg-sky-600 hover:bg-sky-700 focus-visible:ring-sky-500 shadow-sky-600/20">
                                    {"Editer"}
                                </Button>

                                <Button className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500 shadow-red-600/20">
                                    {"Supprimer"}
                                </Button>

                                <Button
                                    className={
                                        isActive
                                            ? "bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500 shadow-amber-600/20"
                                            : "bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500 shadow-emerald-600/20"
                                    }
                                >
                                    {isActive ? "Suspendre" : "Activer"}
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
import { getStoredUser } from '../../utils/authSession';

export default function CustomerProfile() {
    const user = getStoredUser();

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-amber-600">Mon profil</h1>

            <dl className="divide-y divide-slate-100 rounded-2xl border border-amber-200/70 bg-white shadow-sm">
                <div className="grid gap-1 px-5 py-4 sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-slate-500">Nom</dt>
                    <dd className="text-sm text-stone-900 sm:col-span-2">{user?.name ?? '—'}</dd>
                </div>
                <div className="grid gap-1 px-5 py-4 sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-slate-500">Email</dt>
                    <dd className="text-sm text-stone-900 sm:col-span-2">{user?.email ?? '—'}</dd>
                </div>
                <div className="grid gap-1 px-5 py-4 sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-slate-500">Rôle</dt>
                    <dd className="text-sm capitalize text-stone-900 sm:col-span-2">
                        {user?.role ?? '—'}
                    </dd>
                </div>
            </dl>

            <p className="text-xs text-stone-400">
                {/* TODO(customer): édition du profil et téléphone */}
                La modification du profil sera disponible prochainement.
            </p>
        </div>
    );
}

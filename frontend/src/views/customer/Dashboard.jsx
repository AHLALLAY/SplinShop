import { Link } from 'react-router-dom';
import { readUserName } from '../../utils/authSession';

export default function CustomerDashboard() {
    const name = readUserName();

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-amber-600">
                    Bonjour{name ? `, ${name}` : ''}
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                    Bienvenue dans votre espace client. Parcourez la boutique et commandez vos
                    produits via WhatsApp.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Link
                    to="/"
                    className="rounded-2xl border border-amber-200/70 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md"
                >
                    <h2 className="font-semibold text-stone-900">Boutique</h2>
                    <p className="mt-1 text-sm text-stone-600">Voir les catalogues et produits</p>
                </Link>
                <Link
                    to="/customer/profile"
                    className="rounded-2xl border border-amber-200/70 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md"
                >
                    <h2 className="font-semibold text-stone-900">Mon profil</h2>
                    <p className="mt-1 text-sm text-stone-600">Consulter vos informations</p>
                </Link>
            </div>

            <p className="text-xs text-stone-400">
                {/* TODO(customer): historique des commandes */}
                L&apos;historique des commandes sera disponible prochainement.
            </p>
        </div>
    );
}

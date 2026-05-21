import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/authSession';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Auth from '../../services/auth';
import { fieldClass } from '../../utils/formClasses';
import { formatApiError } from '../../utils/formatApiError';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const returnPath = () => {
        const from = location.state?.from;
        if (from?.pathname) {
            return `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`;
        }
        return '/';
    };

    const handleClose = () => {
        navigate(returnPath(), { replace: true });
    };

    useEffect(() => {
        if (isAuthenticated()) {
            navigate(returnPath(), { replace: true });
        }
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            const data = await Auth.register({
                name,
                email,
                password,
                phone: phone.trim() || undefined,
            });
            const from = location.state?.from?.pathname;
            let target = returnPath();
            if (data.role === 'admin' && from?.startsWith('/admin')) {
                target = from;
            } else if (data.role === 'customer') {
                target =
                    from && !from.startsWith('/customer') ? returnPath() : '/customer/dashboard';
            } else if (data.role !== 'customer') {
                target = `/${data.role}/dashboard`;
            }
            navigate(target, { replace: true });
        } catch (err) {
            setError(formatApiError(err));
        }
    };

    return (
        <div className="relative min-h-screen bg-linear-to-br from-slate-100 via-white to-amber-50/40 px-4 py-10">
            <form
                onSubmit={handleSubmit}
                className="mx-auto w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/90 p-8 shadow-lg shadow-slate-200/60 backdrop-blur-sm"
            >
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                            Créer un compte
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Inscription client SplinEdge Shop
                        </p>
                        {error && (
                            <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                {error}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Fermer"
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                    >
                        &times;
                    </button>
                </div>

                <div className="space-y-5 [&_label]:text-sm [&_label]:font-medium [&_label]:text-slate-700">
                    <Input
                        type="text"
                        label="Nom complet"
                        placeholder="Votre nom"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={fieldClass}
                        maxLength={30}
                        autoComplete="name"
                    />
                    <Input
                        type="email"
                        label="Email"
                        placeholder="vous@exemple.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={fieldClass}
                        autoComplete="email"
                    />
                    <Input
                        type="tel"
                        label="Téléphone"
                        placeholder="06XXXXXXXX (optionnel)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={fieldClass}
                        required={false}
                        autoComplete="tel"
                    />
                    <Input
                        type="password"
                        label="Mot de passe"
                        placeholder="8-20 car., maj., min., chiffre, symbole"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={fieldClass}
                        autoComplete="new-password"
                    />
                    <Input
                        type="password"
                        label="Confirmer le mot de passe"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={fieldClass}
                        autoComplete="new-password"
                    />
                </div>

                <div className="mt-8 flex flex-col gap-4">
                    <Button
                        type="submit"
                        className="w-full rounded-xl bg-amber-600! py-3 font-semibold text-white! shadow-md shadow-amber-600/20 transition hover:bg-amber-700! focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 active:scale-[0.98]"
                    >
                        S&apos;inscrire
                    </Button>
                    <p className="text-center text-sm text-slate-600">
                        Déjà un compte ?{' '}
                        <Link
                            to="/login"
                            state={location.state}
                            className="font-medium text-amber-700 underline-offset-4 transition hover:text-amber-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded-sm"
                        >
                            Se connecter
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

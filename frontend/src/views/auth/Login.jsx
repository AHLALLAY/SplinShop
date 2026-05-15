import { useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input.jsx";
import Auth from "../../services/auth.js";
import { useNavigate } from "react-router-dom";

const fieldClass =
    "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/25";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmition = async (e) => {
        e.preventDefault();
        try {
            setError("");
            const loginResponse = await Auth.login({ email, password });
            navigate(`/${loginResponse.role}/dashboard`);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="relative min-h-screen bg-linear-to-br from-slate-100 via-white to-amber-50/40 px-4 py-10">
            <form
                onSubmit={handleSubmition}
                className="mx-auto w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/90 p-8 shadow-lg shadow-slate-200/60 backdrop-blur-sm"
            >
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                            Connexion
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {error && <span className="text-red-600 bg-red-300 border-red-500 rounded-lg">{error}</span>}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        aria-label="Fermer"
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                    >
                        &times;
                    </button>
                </div>

                <div className="space-y-5 [&_label]:text-sm [&_label]:font-medium [&_label]:text-slate-700">
                    <Input
                        type="email"
                        label="Email"
                        placeholder="vous@exemple.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={fieldClass}
                    />
                    <Input
                        type="password"
                        label="Mot de passe"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={fieldClass}
                    />
                </div>

                <div className="mt-8 flex flex-col gap-4">
                    <Button
                        type="submit"
                        className="w-full rounded-xl bg-amber-600! py-3 font-semibold text-white! shadow-md shadow-amber-600/20 transition hover:bg-amber-700! focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 active:scale-[0.98]"
                    >
                        Se connecter
                    </Button>
                    <p className="text-center text-sm text-slate-600">
                        Pas encore de compte ?{" "}
                        <button
                            type="button"
                            className="font-medium text-amber-700 underline-offset-4 transition hover:text-amber-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded-sm"
                        >
                            Créez-en un ici
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
}

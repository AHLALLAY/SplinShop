import { Outlet, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

export default function HomeLayout() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-100 via-white to-amber-50/40">
            <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
                    <img
                        src="/Logo.jpg"
                        alt="Logo SplinEdge Shop"
                        className="h-11 w-11 rounded-full border border-amber-600 object-cover"
                    />

                    <Button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="px-2"
                    >
                        Connexion
                    </Button>
                </div>
            </header>

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8">
                <Outlet />
            </main>

            <footer className="border-t border-slate-200/70 bg-white/70 px-5 py-3.5 text-center text-[11px] text-slate-500 backdrop-blur-md md:px-10">
                SplinEdge Shop · Espace administrateur © {new Date().getFullYear()}
            </footer>
        </div>
    );
}
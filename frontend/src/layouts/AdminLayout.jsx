import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

const navLinkClass =
    "block w-full rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-amber-50/90 hover:text-amber-950";

function navLinkActive({ isActive }) {
    return [
        navLinkClass,
        isActive &&
            "bg-linear-to-r from-amber-50 to-amber-100/80 font-semibold text-amber-950 shadow-sm shadow-amber-900/10 ring-1 ring-amber-200/90",
    ]
        .filter(Boolean)
        .join(" ");
}

export default function AdminLayout() {
    const admin = [
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "Vendeurs", path: "/admin/sellers" },
        { label: "Catalogue", path: "/admin/catalog" },
    ];
    const [name, setName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const raw = localStorage.getItem("user");
        if (!raw) return;
        try {
            const username = JSON.parse(raw);
            setName(username.name ?? "");
        } catch {
            /* ignore */
        }
    }, []);

    const handelLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
    };

    const initial = name?.trim()?.charAt(0)?.toUpperCase() ?? "?";

    return (
        <div className="flex min-h-screen bg-linear-to-br from-slate-100/90 via-slate-50 to-amber-50/30">
            <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-slate-200/80 bg-white/95 px-4 py-6 shadow-[4px_0_24px_-12px_rgba(15,23,42,0.12)] backdrop-blur-sm md:w-64 md:px-5 md:py-8">
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-3 flex h-18 w-full max-w-44 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-amber-50 to-white ring-1 ring-amber-100/80 shadow-sm">
                        <img
                            src="/Logo.jpg"
                            alt="Logo SplinEdge Shop"
                            className="max-h-full max-w-full object-contain object-center"
                        />
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800/85">
                        Administration
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Panneau de contrôle</p>
                </div>

                <nav className="flex flex-1 flex-col gap-1" aria-label="Navigation admin">
                    <ul className="flex flex-col gap-1">
                        {admin.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={navLinkActive}
                                    end={item.path === "/admin/dashboard"}
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="mt-auto border-t border-slate-100 pt-5">
                    <div className="rounded-2xl bg-slate-50/90 p-3 ring-1 ring-slate-100">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-100 to-amber-50 text-sm font-semibold text-amber-900 shadow-inner ring-1 ring-amber-200/60"
                                aria-hidden
                            >
                                {initial}
                            </div>
                            <div className="min-w-0 flex-1 text-left">
                                <p className="truncate text-xs font-medium text-slate-700">{name || "—"}</p>
                                <p className="text-[10px] uppercase tracking-wide text-slate-400">Connecté</p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            onClick={handelLogout}
                            className="mt-3 w-full rounded-xl bg-red-600! py-2.5 text-sm font-semibold text-white! shadow-md shadow-red-600/20 transition hover:bg-red-700! focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 active:scale-[0.98]"
                        >
                            Déconnexion
                        </Button>
                    </div>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <main className="flex-1 px-5 py-7 md:px-10 md:py-9">
                    <div className="mx-auto max-w-6xl">
                        <Outlet />
                    </div>
                </main>
                <footer className="border-t border-slate-200/70 bg-white/70 px-5 py-3.5 text-center text-[11px] text-slate-500 backdrop-blur-md md:px-10">
                SplinEdge Shop · Espace administrateur © {new Date().getFullYear()}
                </footer>
            </div>
        </div>
    );
}

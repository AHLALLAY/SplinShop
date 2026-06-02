import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';

export const navLinkClass =
    'block w-full rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-amber-50/90 hover:text-amber-950';

/**
 * @param {{ isActive: boolean }} props
 * @returns {string}
 */
export function navLinkActive({ isActive }) {
    return [
        navLinkClass,
        isActive &&
        'bg-linear-to-r from-amber-50 to-amber-100/80 font-semibold text-amber-950 shadow-sm shadow-amber-900/10 ring-1 ring-amber-200/90',
    ]
        .filter(Boolean)
        .join(' ');
}

/**
 * Layout latéral partagé (admin / client).
 * @param {object} props
 * @param {string} props.badgeLabel - Ex. « Administration »
 * @param {string} props.subtitle
 * @param {Array<{ label: string, path: string, end?: boolean }>} props.navItems
 * @param {string} props.userName
 * @param {string} props.userRoleLabel
 * @param {string} props.footerText
 * @param {() => void} props.onLogout
 * @param {import('react').ReactNode} props.children
 */
export default function SidebarShell({
    badgeLabel,
    subtitle,
    navItems,
    userName,
    userRoleLabel,
    footerText,
    onLogout,
    children,
}) {
    const initial = userName?.trim()?.charAt(0)?.toUpperCase() ?? '?';
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-linear-to-br from-slate-100/90 via-slate-50 to-amber-50/30">
            {/* Mobile Header Bar */}
            <header className="md:hidden flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 py-3 sticky top-0 z-40 shadow-xs backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <img
                        src="/Logo.jpg"
                        alt="Logo SplinEdge Shop"
                        className="h-9 w-9 rounded-full border border-amber-600 object-cover"
                    />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-800/85">
                            {badgeLabel}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium -mt-0.5">{subtitle}</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                    aria-label="Ouvrir le menu"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </header>

            {/* Mobile Drawer Overlay / Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Navigation Drawer */}
            <div
                className={`fixed inset-y-0 left-0 z-50 flex w-72 transform flex-col border-r border-slate-200/80 bg-white px-5 py-6 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <img
                            src="/Logo.jpg"
                            alt="Logo SplinEdge Shop"
                            className="h-8 w-8 rounded-full border border-amber-600 object-cover"
                        />
                        <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
                            {badgeLabel}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                        aria-label="Fermer le menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex flex-1 flex-col gap-1" onClick={() => setIsOpen(false)}>
                    <ul className="flex flex-col gap-1">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={navLinkActive}
                                    end={item.end ?? false}
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
                                <p className="truncate text-xs font-medium text-slate-700">
                                    {userName || '—'}
                                </p>
                                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                                    {userRoleLabel}
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                onLogout();
                            }}
                            className="mt-3 w-full rounded-xl bg-red-600! py-2.5 text-sm font-semibold text-white! shadow-md shadow-red-600/20 transition hover:bg-red-700! focus-visible:outline-none"
                        >
                            Déconnexion
                        </Button>
                    </div>
                </div>
            </div>

            {/* Desktop Sidebar */}
            <aside className="sticky top-0 hidden md:flex h-screen w-60 shrink-0 flex-col border-r border-slate-200/80 bg-white/95 px-4 py-6 shadow-[4px_0_24px_-12px_rgba(15,23,42,0.12)] backdrop-blur-sm md:w-64 md:px-5 md:py-8">
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-3 flex h-18 w-full max-w-44 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-amber-50 to-white ring-1 ring-amber-100/80 shadow-sm">
                        <img
                            src="/Logo.jpg"
                            alt="Logo SplinEdge Shop"
                            className="max-h-full max-w-full object-contain object-center"
                        />
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800/85">
                        {badgeLabel}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
                </div>

                <nav className="flex flex-1 flex-col gap-1" aria-label={badgeLabel}>
                    <ul className="flex flex-col gap-1">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={navLinkActive}
                                    end={item.end ?? false}
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
                                <p className="truncate text-xs font-medium text-slate-700">
                                    {userName || '—'}
                                </p>
                                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                                    {userRoleLabel}
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            onClick={onLogout}
                            className="mt-3 w-full rounded-xl bg-red-600! py-2.5 text-sm font-semibold text-white! shadow-md shadow-red-600/20 transition hover:bg-red-700! focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 active:scale-[0.98]"
                        >
                            Déconnexion
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex min-w-0 flex-1 flex-col">
                <main className="flex-1 px-5 py-7 md:px-10 md:py-9">
                    <div className="mx-auto max-w-6xl">{children}</div>
                </main>
                <footer className="border-t border-slate-200/70 bg-white/70 px-5 py-3.5 text-center text-[11px] text-slate-500 backdrop-blur-md md:px-10">
                    {footerText} © {new Date().getFullYear()}
                </footer>
            </div>
        </div>
    );
}

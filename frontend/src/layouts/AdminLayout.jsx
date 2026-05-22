import { Outlet, Navigate, useLocation } from 'react-router-dom';
import SidebarShell from '../components/layout/SidebarShell';
import { useAuth } from '../hooks/useAuth';

const adminNav = [
    { label: 'Dashboard', path: '/admin/dashboard', end: true },
    { label: 'Vendeurs', path: '/admin/sellers' },
    { label: 'Catalogue', path: '/admin/catalog' },
];

export default function AdminLayout() {
    const { name, isAdmin, logout } = useAuth();
    const location = useLocation();

    if (!isAdmin) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return (
        <SidebarShell
            badgeLabel="Administration"
            subtitle="Panneau de contrôle"
            navItems={adminNav}
            userName={name}
            userRoleLabel="Connecté"
            footerText="SplinEdge Shop · Espace administrateur"
            onLogout={logout}
        >
            <Outlet />
        </SidebarShell>
    );
}

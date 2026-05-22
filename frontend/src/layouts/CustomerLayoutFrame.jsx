import { Outlet } from 'react-router-dom';
import SidebarShell from '../components/layout/SidebarShell';
import { useAuth } from '../hooks/useAuth';

const customerNav = [
    { label: 'Tableau de bord', path: '/customer/dashboard', end: true },
    { label: 'Boutique', path: '/', end: false },
    { label: 'Mon profil', path: '/customer/profile', end: true },
];

export default function CustomerLayoutFrame() {
    const { name, logout } = useAuth();

    return (
        <SidebarShell
            badgeLabel="Espace client"
            subtitle="Votre compte"
            navItems={customerNav}
            userName={name}
            userRoleLabel="Client"
            footerText="SplinEdge Shop · Espace client"
            onLogout={logout}
        >
            <Outlet />
        </SidebarShell>
    );
}

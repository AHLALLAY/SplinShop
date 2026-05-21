import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAdmin, isCustomer } from '../utils/authSession';
import HomeLayout from './HomeLayout';
import CustomerLayoutFrame from './CustomerLayoutFrame';

/**
 * Boutique publique : HomeLayout pour les invités,
 * CustomerLayoutFrame pour les clients connectés (comme AdminLayout pour l’admin).
 */
export default function ShopEntryLayout() {
    const location = useLocation();
    const isCustomerArea = location.pathname.startsWith('/customer');

    if (isCustomerArea) {
        if (isAdmin()) {
            return <Navigate to="/admin/dashboard" replace />;
        }
        if (!isCustomer()) {
            return <Navigate to="/login" replace state={{ from: location }} />;
        }
    }

    if (isCustomer()) {
        return <CustomerLayoutFrame />;
    }

    return <HomeLayout />;
}

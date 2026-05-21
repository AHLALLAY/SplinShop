import { Navigate, useLocation } from 'react-router-dom';
import { isAdmin, isCustomer } from '../utils/authSession';
import CustomerLayoutFrame from './CustomerLayoutFrame';

/** Routes réservées à /customer/* (redirection si non client). */
export default function CustomerLayout() {
    const location = useLocation();

    if (!isCustomer()) {
        if (isAdmin()) {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <CustomerLayoutFrame />;
}

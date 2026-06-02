import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import { isAdmin, isCustomer, readUserName } from '../utils/authSession';

/**
 * Session utilisateur et actions auth centralisées.
 * @returns {{
 *   name: string,
 *   isAdmin: boolean,
 *   isCustomer: boolean,
 *   logout: () => void
 * }}
 */
export function useAuth() {
    const navigate = useNavigate();

    const logout = useCallback(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    }, [navigate]);

    return useMemo(
        () => ({
            name: readUserName(),
            isAdmin: isAdmin(),
            isCustomer: isCustomer(),
            login: authService.login.bind(authService),
            register: authService.register.bind(authService),
            logout,
        }),
        [logout],
    );
}

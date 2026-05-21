/**
 * Session stockée au login (localStorage).
 */

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('token'));
}

export function hasRole(role) {
  if (!isAuthenticated()) return false;
  return getStoredUser()?.role === role;
}

export function isAdmin() {
  return hasRole('admin');
}

export function isCustomer() {
  return hasRole('customer');
}

export function readUserName() {
  return getStoredUser()?.name ?? '';
}

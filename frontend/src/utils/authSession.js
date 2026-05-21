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

export function isAdmin() {
  if (!isAuthenticated()) return false;
  const user = getStoredUser();
  return user?.role === 'admin';
}

export function readUserName() {
  return getStoredUser()?.name ?? '';
}

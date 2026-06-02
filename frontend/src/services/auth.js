import callEndpoint from './apiHandler';

class AuthService {
  /**
   * Connexion : persiste l'utilisateur et le token.
   * @param {{ email: string, password: string }} credentials - Les identifiants
   * @returns {Promise<object>}
   */
  async login(credentials) {
    const response = await callEndpoint('/auth/login', 'POST', credentials);
    localStorage.setItem('user', JSON.stringify(response.data));
    localStorage.setItem('token', response.data.token);

    return response.data;
  }

  /**
   * Inscription d'un client.
   * @param {{ name: string, email: string, password: string, phone?: string }} payload - Les données du client
   * @returns {Promise<object>}
   */
  async register(payload) {
    const response = await callEndpoint('/auth/register', 'POST', payload);
    localStorage.setItem('user', JSON.stringify(response.data));
    localStorage.setItem('token', response.data.token);

    return response.data;
  }

  /**
   * Déconnexion de l'utilisateur.
   */
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}

export default new AuthService();

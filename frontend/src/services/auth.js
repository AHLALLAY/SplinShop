import callEndpoint from './apiHandler';

class Authentification {
  /**
   * Connexion : persiste user + token dans localStorage.
   * @param {{ email: string, password: string }} credentials
   */
  async login(credentials) {
    const body = {
      email: credentials.email,
      password: credentials.password,
    };
    const response = await callEndpoint('/auth/login', 'POST', body);
    localStorage.setItem('user', JSON.stringify(response.data));
    localStorage.setItem('token', response.data.token);

    return response.data;
  }

  /**
   * Inscription client.
   * @param {{ name: string, email: string, password: string, phone?: string }} payload
   */
  async register(payload) {
    const body = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    };
    if (payload.phone) body.phone = payload.phone;

    const response = await callEndpoint('/auth/register', 'POST', body);
    localStorage.setItem('user', JSON.stringify(response.data));
    localStorage.setItem('token', response.data.token);

    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}

export default new Authentification();

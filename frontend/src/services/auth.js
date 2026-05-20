import callEndpoint from './apiHandler';

class Authentification {
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

  // TODO(auth): implémenter quand la route register sera disponible
  async register() { }

  logout() { 
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}

export default new Authentification();

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

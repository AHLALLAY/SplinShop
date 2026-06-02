/**
 * Client HTTP vers l’API backend.
 *
 * @param {string} endpoint - Chemin (ex. `/catalogs`) ou URL absolue
 * @param {string} [method='GET']
 * @param {object|FormData|null} [body=null]
 * @param {string|null} [token] - JWT ; par défaut `localStorage.token`
 * @returns {Promise<object>} Corps JSON de la réponse
 * @throws {Error} Si HTTP non OK ou réseau
 */
async function callEndpoint(
  endpoint,
  method = 'GET',
  body = null,
  token = localStorage.getItem('token'),
) {
  if (!endpoint) throw new Error('Le paramètre endpoint est requis');

  const headers = {};
  const methodsWithBody = ['POST', 'PUT', 'PATCH'];
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (methodsWithBody.includes(method.toUpperCase()) && body && !isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const requestBody = body ? (isFormData ? body : JSON.stringify(body)) : null;
  const url = endpoint.startsWith(import.meta.env.VITE_API_URL)
    ? endpoint
    : `${import.meta.env.VITE_API_URL}${endpoint}`;

  const response = await fetch(url, {
    method: method.toUpperCase(),
    headers,
    body: requestBody,
  });

  const data = await response.json().catch(() => ({ message: 'Erreur inconnue' }));

  if (!response.ok) {
    const error = new Error(data.message || `Erreur HTTP : ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export default callEndpoint;

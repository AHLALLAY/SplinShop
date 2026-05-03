async function useEndPoint(endpoint, method = "GET", body = null, token = localStorage.getItem('token')) {
    try {
        const headers = {};
        const methods = ['POST', 'PUT', 'PATCH'];

        if (!endpoint) throw new Error('endpoint is required');
        if (methods.includes(method.toUpperCase()) && body) headers['Content-Type'] = 'application/json';
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const requestBody = body ? JSON.stringify(body) : null;
        const url = endpoint.startsWith(process.env.VITE_API_URL) ? endpoint : `${VITE_API_URL}${endpoint}`;
        const response = await fetch(url, {
            method: method.toUpperCase(),
            headers: headers,
            body: requestBody
        });
        const data = await response.json().catch(() => ({ message: 'unknown error' }));
        if (!response.ok) {
            const error = new Error(data.message || `HTTP Error ! Status : ${response.status}`);
            error.status = response.status;
            error.data = data;
            throw error;
        }
        return data;
    } catch (err) {
        console.error(`API ERROR :${err}`);
        throw error;
    }
}
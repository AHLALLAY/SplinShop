async function useEndPoint(endpoint, method = "GET", body = null, token = localStorage.getItem('token')) {
    try {
        const headers = {};
        const methods = ['POST', 'PUT', 'PATCH'];
        const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

        if (!endpoint) throw new Error('endpoint is required');
        if (methods.includes(method.toUpperCase()) && body && !isFormData) {
            headers['Content-Type'] = 'application/json';
        }
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const requestBody = body
            ? isFormData
                ? body
                : JSON.stringify(body)
            : null;
        const url = endpoint.startsWith(import.meta.env.VITE_API_URL) ? endpoint : `${import.meta.env.VITE_API_URL}${endpoint}`;
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
        throw err;
    }
}

export default useEndPoint;
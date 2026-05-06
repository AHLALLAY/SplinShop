import useEndPoint from "./apiHandler.js";
class Authentification {
    async login(credentials) {
        const body = {
            email: credentials.email,
            password: credentials.password
        }
        const response = await useEndPoint("/auth/login", "POST", body);
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("token", response.data.token);
        
        return response.data;
    }

    async register() {

    }

    logout() {

    }
}

export default new Authentification();
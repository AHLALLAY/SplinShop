import authService from "../../services/auth/auth.service.js";

class AuthController {
    async login(req, res) {
        try {
            const user = await authService.login(req.body);
            return res.status(200).json({
                success: true,
                message: "connecté",
                data: user
            });

        } catch (err) {
            return res.status(err.statusCode || 500).json({
                success: false,
                message: "connexion échouée",
                error: err.message,
            });
        }
    }
}

export default new AuthController();
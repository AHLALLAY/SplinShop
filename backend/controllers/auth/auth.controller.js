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
            const statusCode = err.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                message: err.message || 'connexion échouée',
                ...(err.fieldErrors && { fieldErrors: err.fieldErrors }),
            });
        }
    }
}

export default new AuthController();
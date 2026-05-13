import userService from "../../services/admin/user.service.js";

class UserController {
    async addSeller(req, res) {
        try {
            const seller = await userService.addSeller(req.body);
            return res.status(201).json({
                success: true,
                message: "Ajouté",
                data: seller,
            });
        } catch (err) {
            const statusCode = err.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                message: err.message || "l'ajout du vendeur a échoué",
                ...(err.fieldErrors && { fieldErrors: err.fieldErrors }),
            });
        }
    }

    async getSellers(req, res) {
        try {
            const sellers = await userService.getSellers();
            return res.status(200).json({
                success: true,
                message: "les vendeurs qui existent",
                data: sellers,
            });
        } catch (err) {
            const statusCode = err.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                message: err.message || 'les vendeurs ne sont pas disponibles',
                ...(err.fieldErrors && { fieldErrors: err.fieldErrors }),
            });
        }
    }
}

export default new UserController();
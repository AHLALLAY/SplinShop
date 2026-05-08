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
            return res.status(err.statusCode || 500).json({
                success: false,
                message: "l'ajoute de vendeur échouée",
                error: err.message,
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
            return res.status(err.statusCode || 500).json({
                success: false,
                message: "les venduers ne sont pas là",
                error: err.message,
            });
        }
    }
}

export default new UserController();
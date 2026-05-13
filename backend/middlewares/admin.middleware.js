/**
 * À placer après isAuthenticated : exige un utilisateur avec le rôle admin.
 */
export default function requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Accès réservé aux administrateurs',
        });
    }
    return next();
}

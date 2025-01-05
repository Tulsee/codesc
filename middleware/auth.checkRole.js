export function authCheckRole(role) {
    return function (req, res, next) {
        if (req.user.role !== role) {
            return res.status(403).json({message: "You do not have permission to perform this action."});
        }
        next()
    }
}
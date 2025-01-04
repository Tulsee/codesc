import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({message: 'No token provided'});
        }

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decodedToken.id,
            email: decodedToken.email
        };
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Authentication failed',
            error: error.message
        });
    }
}
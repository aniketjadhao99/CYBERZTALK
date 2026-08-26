import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};

export const authorize = (...roles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.userId).select('role');

            if (!user || !roles.includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to access this resource'
                });
            }

            req.userRole = user.role;
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Unable to verify user role'
            });
        }
    };
};

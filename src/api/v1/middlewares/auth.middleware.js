import jwt from 'jsonwebtoken';
import config from '../../../config/index.js';
import logger from '../../../core/logger.js';
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger.warn('Unauthorized access attempt: No token provided');
        return res.status(401).json({ message: 'Authentication required' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        logger.warn('Unauthorized access attempt: No token provided');
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const decoded = jwt.verify(token, config.auth.jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        logger.error('JWT Verification failed: %o', error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
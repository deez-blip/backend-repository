// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: "Token manquant !" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findByPk(decoded.id);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token invalide !" });
    }
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'ROLE_ADMIN') {
        return res.status(403).json({ message: "Accès réservé aux administrateurs !" });
    }
    next();
};

module.exports = { authenticate, authorizeAdmin };

const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user?.role === 'admin') return next();
        res.status(403).json({ message: 'Admin privileges required' });
    });
};

module.exports = { verifyToken, verifyAdmin, SECRET_KEY };

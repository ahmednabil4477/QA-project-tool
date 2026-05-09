const jwt = require('jsonwebtoken');

const SECRET_KEY = 'horizon_secret_key_change_in_production';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token" });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: "Authorization header missing" });
    }
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: "Admin privileges required" });
        }
    });
};

module.exports = { verifyToken, verifyAdmin, SECRET_KEY };

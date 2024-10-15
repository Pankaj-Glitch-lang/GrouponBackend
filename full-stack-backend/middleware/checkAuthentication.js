const Secret_Key=process.env.Secret_Key;
const jwt = require('jsonwebtoken')
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // Make sure 'Bearer <token>' format is correct

    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, Secret_Key);
        req.body.userId = decoded.userId; // Attach the decoded user info to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = { authenticate }

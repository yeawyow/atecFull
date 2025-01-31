const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const blacklist = require('../utils/blacklist');

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        if (token && blacklist.has(token.trim())) {
            return res.status(401).json({ message: 'Token revoked' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // เช็คว่ามี token อยู่ใน blacklist หรือไม่
            if (blacklist.has(token.trim())) {
                return res.status(401).json({ message: 'Token revoked' });
            }

            // เพิ่ม user ลง req
            req.user = await User.findUserById(decoded.userId);

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            next();

        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                console.log("Token expired, removing from blacklist:", token);
                blacklist.delete(token.trim()); // ลบ token ที่หมดอายุออก
                return res.status(401).json({ message: 'Token expired' });
            }
            return res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        return res.status(401).json({ message: 'No token provided' });
    }
};


module.exports = auth;
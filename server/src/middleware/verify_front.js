const jwt = require('jsonwebtoken');
const blacklist = require('../utils/blacklist');

const verify_front = async (req) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        try {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);
            
            // เช็คว่ามี token อยู่ใน blacklist หรือไม่
            if (blacklist.has(token.trim())) {
                return false;
            }

            return true; // Token ถูกต้องและไม่อยู่ใน blacklist

        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return false; // Token หมดอายุ
            }
            return false; // Token ไม่ถูกต้อง
        }
    } else {
        return false; // ไม่มี token ใน header
    }
};

module.exports = verify_front;
const jwt = require('jsonwebtoken');
const blacklist = require('./blacklist'); // ไฟล์จัดการ blacklist
const dotenv = require('dotenv').config({ path: './src/.env' }); // ตรวจสอบ path อีกครั้ง

const trackTokensMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // ดึง token จาก header

        try {
            // ตรวจสอบว่า token ยังไม่หมดอายุ
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // ตรวจสอบว่า token ถูกสร้างจากระบบของคุณหรือไม่
            if (decoded.issuer != process.env.JWT_SECRET) {
                await blacklist.add(token);
                console.log(`Token added to blacklist: ${token}`);
                console.log(`Token is from another system: ${token}`);
            } 
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                console.log(`Token expired: ${token}`);
            } else {
                console.error(`Error verifying token: ${token}`, err);
            }
        }
    }

    next(); // ไปยัง middleware หรือ route ถัดไป
};

module.exports = trackTokensMiddleware;
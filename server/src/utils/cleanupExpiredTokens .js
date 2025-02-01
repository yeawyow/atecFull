const jwt = require('jsonwebtoken');
const blacklist = require('../utils/blacklist'); // สมมติว่า blacklist เป็น Set หรือ Map

const cleanupExpiredTokens = async () => {
    const tokensToDelete = []; // เก็บ token ที่หมดอายุไว้ลบทีเดียว

    for (const token of blacklist) {
        try {
            // ตรวจสอบว่า token หมดอายุหรือไม่
            jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                tokensToDelete.push(token); // เพิ่ม token ที่หมดอายุเข้า list
            }
        }
    }

    // ลบ token ที่หมดอายุออกจาก blacklist
    tokensToDelete.forEach((token) => {
        blacklist.delete(token.trim());
    });

    console.log(`Cleaned up ${tokensToDelete.length} expired tokens from blacklist.`);
};

module.exports = cleanupExpiredTokens;
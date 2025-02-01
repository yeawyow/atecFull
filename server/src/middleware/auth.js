const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const blacklist = require('../utils/blacklist');
const dotenv = require('dotenv').config({ path: './src/.env' }); // ตรวจสอบ path อีกครั้ง

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if(token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                
                // เช็คว่ามี token อยู่ใน blacklist หรือไม่
                if (blacklist.has(token.trim())) {
                    return res.status(401).json({ message: 'Token revoked' });
                }
    
                console.log("Blacklist:", blacklist);
                next();
    
            } catch (err) {
                if (err.name === 'TokenExpiredError') {
                    // console.log("Token expired, removing from blacklist:", token);
                    // blacklist.delete(token.trim()); // ลบ token ที่หมดอายุออก
                    console.log("Blacklist:", blacklist);
                    return res.status(401).json({ message: 'Token expired' });
                }
                return res.status(401).json({ message: 'Invalid token' });
            }
        } else {
            console.log('ไม่มี Token');
            exit();
        }

        
    } else {
        return res.status(401).json({ message: 'No token provided' });
    }
};


module.exports = auth;
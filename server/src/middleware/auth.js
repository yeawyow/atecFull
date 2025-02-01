const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const blacklist = require('../utils/blacklist');
const dotenv = require('dotenv').config({ path: './src/.env' }); // ตรวจสอบ path อีกครั้ง

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            if (!token) {
                return res.status(401).json({ message: 'ไม่มี Token ถูกสร้างมากรุณา Login ใหม่เพื่อสร้าง Token!' });
            }
            
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);
            
            // เช็คว่ามี token อยู่ใน blacklist หรือไม่
            if (blacklist.has(token.trim())) {
                return res.status(401).json({ message: 'Token นี้ไม่สามารถใช้งานได้แล้วกรุณา Login ใหม่เพื่อขอ Token!' });
            }
            
            user = decoded; // เก็บข้อมูล decoded token ใน req.user เพื่อใช้ใน route ถัดไป
            next(); // ส่งการควบคุมไปยัง middleware หรือ route ถัดไป

        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token หมดอายุกรุณา Login ใหม่!' }); // Token expired
            }
            return res.status(401).json({ message: 'ไม่พบ Token กรุณา Login ใหม่เพื่อขอ Token อีกครั้ง!' });
        }        
    } else {
        return res.status(401).json({ message: 'ไม่มี Token ถูกส่งมากรุณาส่ง Token มาเพื่อตรวจสอบ Thank you!' });
    }
};


module.exports = auth;
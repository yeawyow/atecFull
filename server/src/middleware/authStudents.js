const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const blacklist = require('../utils/blacklist');
const dotenv = require('dotenv').config({ path: './src/.env' }); // ตรวจสอบ path อีกครั้ง

// Function จัดการ Message Error และ Success
function msg(res, status, message) {
    return res.status(status).json({ message: message });
}

const authStudents = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            if (!token) {
                return msg(res, 401, 'ไม่มี Token ในการ login ถูกสร้างมากรุณา Login ใหม่เพื่อสร้าง Token!');
            }
            
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);
            
            // เช็คว่ามี token อยู่ใน blacklist หรือไม่
            if (blacklist.has(token.trim())) {
                return msg(res, 401, 'ไม่สามารถใข้งานระบบได้กรุณา Login ใหม่!');
            }
            
            req.user = decoded; // เก็บข้อมูล decoded token ใน req.user เพื่อใช้ใน route ถัดไป

            if(req.user.role === 'student') {
                next();
            } else {
                return msg(res, 401, 'User ไม่มีใช่ student!');
            }

        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return msg(res, 401, 'Token หมดอายุกรุณา Login ใหม่!');
            }
            return msg(res, 401, 'ไม่พบ Token กรุณา Login ใหม่เพื่อขอ Token อีกครั้ง!');
        }        
    } else {
        return msg(res, 401, 'ไม่มี Token ถูกส่งมากรุณาส่ง Token มาเพื่อตรวจสอบ Thank you!');
    }
};

module.exports = authStudents;
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config({ path: './src/.env' }); // ตรวจสอบ path อีกครั้ง
const blacklist = require('../utils/blacklist');

exports.register = async (req, res, next) => {

    const { user_national_id, password } = req.body;
    
    if (!user_national_id || !password) {
        return res.status(400).json({ message: 'UserNationalID and Password are required!' });
    }
    
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    
    try {
        // ตรวจสอบว่ามีผู้ใช้งานอยู่แล้วหรือไม่
        const [existingUser] = await User.findUser(user_national_id);
        if (existingUser) {
            return res.status(400).json({ message: 'มี user_national_id อยู่ในระบบแล้ว!' });
        }
    
        // บันทึกผู้ใช้งานใหม่
        const result = await User.createUser(req.body);  // ไม่ต้อง destructure อีกแล้ว
        res.status(200).json({ message: 'User registered successfully!' });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const { user_national_id, password } = req.body;

    try {
        const existingUser = await User.checkUser(user_national_id);
        if (!existingUser || existingUser.length === 0) {
            return res.status(400).json({ message: 'ไม่มี UserNationalID นี้อยู่ในระบบ!' });
        }

        const existingPassword = await User.checkPassword(user_national_id, password);
        if (!existingPassword) {
            return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง!' });
        }

        const payload = {
            userId: existingPassword.id,
            issuer: process.env.JWT_SECRET // เพิ่ม issuer เพื่อระบุว่า token นี้สร้างจากระบบของคุณ
        };

        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, "Signing Token with SECRET: ": process.env.JWT_SECRET });
    } catch (err) {
        next(err);
    }
};

exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            console.log("Auth Header:", authHeader);
            const token = authHeader.split(' ')[1]; 

            if (token) {
                if (blacklist.has(token.trim())) {
                    return res.status(401).json({ message: 'มีการ Logout ด้วย Token นี้แล้ว!' });
                }

                console.log("Token to blacklist:", token);
                blacklist.add(token.trim()); 
                console.log("Blacklist:", blacklist);
            }
        }
        // res.send('Logged out successfully!');
        return res.status(200).json({ message: "Logged out successfully!" });
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.check_token_blacklist = async (req, res, next) => {
    try {
        if (blacklist.size > 0) {
            // แปลง Set เป็น Array และส่งกลับ
            const blacklistArray = Array.from(blacklist);
            return res.status(200).json({ blacklist: blacklistArray });
        } else {
            return res.status(404).json({ message: "ไม่มี Token ใน Blacklist" });
        }
    } catch (err) {
        next(err);
    }
};

exports.profile = async (req, res) => { 
    try {
        res.status(200).json({ message: 'เข้าสู่หน้า Profile' });
    } catch (error) {
        console.error("Profile error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config({ path: './src/.env' }); // ตรวจสอบ path อีกครั้ง
const blacklist = require('../utils/blacklist');

// Function จัดการ Message Error และ Success
function msg(res, status, message) {
    return res.status(status).json({ message: message });
}

// สมัครสมาชิก
exports.register = async (req, res, next) => {
    const { user_national_id, password, role_id } = req.body;

    const checkST = await User.RCheckST(user_national_id, role_id);

    if(checkST.type === 'none') {
        return msg(res, 401, checkST.message);
    } else if(checkST.type === 'error') {
        return msg(res, 401, checkST.message);
    }

    let national_id;
    let type;
    if(checkST.type === 'student' || checkST.type === 'teacher') {
        type = checkST.type;
        national_id = checkST.data;
    } else {
        type = checkST.type;
        national_id = user_national_id;
    }

    const data = {
        type: type,
        national_id: national_id,
        password: password,
        role_id: role_id
    }
    
    if (!user_national_id || !password) {
        return msg(res, 401, 'UserNationalID and Password are required!');
    }
    
    if (password.length < 8) {
        return msg(res, 401, 'Password must be at least 8 characters long');
    }
    
    try {
        // ตรวจสอบว่ามีผู้ใช้งานอยู่แล้วหรือไม่
        const [existingUser] = await User.findUser(user_national_id);
        if (existingUser) {
            return msg(res, 401, 'มี user อยู่ในระบบแล้ว!');
        }
    
        // บันทึกผู้ใช้งานใหม่
        const result = await User.createUser(data);  // ไม่ต้อง destructure อีกแล้ว
        return msg(res, 200, 'User registered successfully!');
    } catch (err) {
        return msg(res, 500, err);
    }
};

exports.login = async (req, res, next) => {
    const { user_national_id, password } = req.body;

    try {
        const existingUser = await User.checkUser(user_national_id);
        if (!existingUser || existingUser.length === 0) {
            return msg(res, 401, 'ไม่มีข้อมูลในระบบ!');
        }

        const existingPassword = await User.checkPassword(user_national_id, password);
        if (!existingPassword) {
            return msg(res, 401, 'รหัสผ่านไม่ถูกต้อง!');
        }

        const checkUserRole = await User.checkUserRole(existingPassword);
        if (!checkUserRole) {
            return msg(res, 401, 'ไม่มีข้อมูลของสิทธิ์!');
        }

        const checkST = await User.LCheckST(existingPassword);
        if(!checkST) {
            return msg(res, 401, 'ไม่มีข้อมูล Student หรือ Teacher!');
        }

        const payload = {
            userId: existingPassword.id,
            role: checkUserRole,
            userData: checkST
        };

        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        return msg(res, 200, token);
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
                    return msg(res, 401, 'มีการ Logout ด้วย Token นี้แล้ว!');
                }

                // console.log("Token to blacklist:", token);
                blacklist.add(token.trim()); 
                // console.log("Blacklist:", blacklist);
            }
        }
        // res.send('Logged out successfully!');
        return msg(res, 200, 'Logged out successfully!');
    } catch (err) {
        console.error("Logout error:", err);
        return msg(res, 500, 'Internal server error!');
    }
};

exports.check_token_blacklist = async (req, res, next) => {
    try {
        if (blacklist.size > 0) {
            // แปลง Set เป็น Array และส่งกลับ
            const blacklistArray = Array.from(blacklist);
            return msg(res, 200, blacklistArray);
        } else {
            return msg(res, 404, 'ไม่มี Token ใน Blacklist');
        }
    } catch (err) {
        next(err);
    }
};

exports.profile = async (req, res) => { 
    try {
        const user = req.user;
        return msg(res, 200, user);
    } catch (error) {
        console.error("Profile error:", error);
        return msg(res, 500, 'Internal server error');
    }
};
// routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController'); // เรียกใช้งาน Controller ที่จัดการการสมัครสมาชิกและเข้าสู่ระบบ

const router = express.Router(); // สร้าง Router สำหรับการจัดการเส้นทาง

// เส้นทางสำหรับการสมัครสมาชิก
router.post('/register', registerUser);

// เส้นทางสำหรับการเข้าสู่ระบบ
router.post('/login', loginUser);

module.exports = router; // ส่ง Router กลับไปที่ไฟล์หลัก

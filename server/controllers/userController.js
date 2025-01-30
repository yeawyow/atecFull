// controllers/userController.js
const User = require('../models/userModel'); // นำเข้า Model ของผู้ใช้

// ฟังก์ชันสำหรับการสมัครสมาชิก
const registerUser = async (req, res) => {
  const { username, email, password } = req.body; // รับข้อมูลจาก body request

  try {
    // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ถ้าผู้ใช้ยังไม่มี, ทำการสร้างผู้ใช้ใหม่
    const newUser = await User.create({ username, email, password });
    res
      .status(201)
      .json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ฟังก์ชันสำหรับการเข้าสู่ระบบ
const loginUser = async (req, res) => {
  const { email, password } = req.body; // รับข้อมูลจาก body request

  try {
    // ค้นหาผู้ใช้จากอีเมล
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ตรวจสอบรหัสผ่าน (ในกรณีนี้เราใช้รหัสผ่านตรงๆ โดยไม่มีการเข้ารหัส)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };

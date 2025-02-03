const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const teacherRoutes = require('./src/routes/teacherRoutes');
const userRoutes = require('./src/routes/userRoutes');
const cron = require('node-cron');
const cleanupExpiredTokens = require('./src/utils/cleanupExpiredTokens '); // นำเข้าไฟล์ฟังก์ชัน
const trackTokensMiddleware = require('./src/utils/trackTokensMiddleware');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());

// เรียกใช้ middleware เพื่อบันทึก token จาก request
app.use(trackTokensMiddleware);

// Route
app.use('/api', teacherRoutes);
app.use('/auth', userRoutes);

// ตั้งเวลาเรียกใช้ cleanupExpiredTokens ทุก 5 นาที
cron.schedule('*/5 * * * *', () => {
    console.log('Running cleanupExpiredTokens...');
    cleanupExpiredTokens();
});

module.exports = app;
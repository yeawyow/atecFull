const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'mysql', // ระบุฐานข้อมูลเป็น MySQL
  logging: false, // ปิดการแสดง log ของ SQL queries
});

const testConnection = async () => {
  try {
    // ทดสอบการเชื่อมต่อ
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

module.exports = sequelize;

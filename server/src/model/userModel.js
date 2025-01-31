const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async findUser(user_national_id) {
        const [rows] = await db.query('SELECT * FROM users WHERE user_national_id = ?', [user_national_id]);
        return rows;
    }

    static async createUser(user) {
        const { user_national_id, password } = user;
    
        // ดึงค่าวันที่ + เวลา ณ ปัจจุบัน
        const currentDate = new Date();
    
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // ดำเนินการ query การ insert
        const result = await db.query(
            'INSERT INTO users (user_national_id, password, created_at, staff_created, updated_at, staff_updated) VALUES (?, ?, ?, ?, ?, ?)',
            [user_national_id, hashedPassword, currentDate, 'Admin', currentDate, 'Admin']
        );
    
        // คืนค่าผลลัพธ์ที่ได้จากการ query ซึ่งจะเป็น object เกี่ยวกับการ insert
        return result[0];  // หรือ `result.insertId` ก็ได้ ถ้าต้องการแค่ insertId
    }

    static async findUserById(id) { // เพิ่ม function นี้
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error("Error in findUserById:", error);
            throw error; // Re-throw error for handling in calling function
        }
    }

    static async checkUser(user_national_id) { // แก้ไข function นี้
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE user_national_id = ?', [user_national_id]);
            return rows[0] || null;
        } catch (error) {
            console.error("Error in checkUser:", error);
            throw error;
        }
    }
    
    static async checkPassword(user_national_id, password) {
        const [rows] = await db.query('SELECT * FROM users WHERE user_national_id = ?', [user_national_id]);
        
        if (rows.length > 0) {
            const user = rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return user;  // คืนค่าผู้ใช้เมื่อรหัสผ่านถูกต้อง
            }
        }
        return null;  // คืนค่า null ถ้ารหัสผ่านไม่ตรง
    }
    
    static async updateTokenUser(token, user_national_id) { // แก้ไข function นี้
        try {
            const expireAt = new Date(Date.now() + 60 * 60 * 1000);
            const result_update = await db.query(
                "UPDATE users SET token = ?, expire_at = ? WHERE user_national_id = ?",
                [token, expireAt, user_national_id]
            );
            return result_update;
        } catch (error) {
            console.error("Error in updateTokenUser:", error);
            throw error;
        }
    }
    
}

module.exports = User;
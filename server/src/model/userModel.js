const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    // Register Start
    static async RCheckST(user_national_id, role_id) {
        try {
            if(role_id === '2') { // 2 = teacher
                const [teacher] = await db.query(
                    'SELECT national_id FROM teachers WHERE national_id = ?',
                    [user_national_id]
                );
                if(teacher.length > 0) {
                    return { type: 'teacher', data: teacher[0].national_id };
                }
                return { type: 'error', message: 'ไม่มีข้อมูลในทะเบียน Teacher! กรุณาตรวจสอบทะเบียน Teacher' };
            } else if(role_id === '3') { // 3 = student
                const [student] = await db.query(
                    'SELECT national_id FROM students WHERE national_id = ?',
                    [user_national_id]
                );
                if(student.length > 0) {
                    return { type: 'student', data: student[0].national_id };
                }
                return { type: 'error', message: 'ไม่มีข้อมูลในทะเบียน Student กรุณาตรวจสอบทะเบียน Student!' };
            } else if(role_id === '1') {
                const [teacher] = await db.query(
                    'SELECT national_id FROM teachers WHERE national_id = ?',
                    [user_national_id]
                );
                if(teacher.length > 0) {
                    return { type: 'teacher', data: teacher[0].national_id };
                }
                return { type: 'error', message: 'ไม่มีข้อมูลในทะเบียน Teacher กรุณาตรวจสอบทะเบียน Teacher!' };
            }

            return { type: 'none', message: 'กรุณาตรวจสอบทะเบียน Student & Teacher ก่อนทำการ Generate User!' };
        } catch (error) {
            console.error('Error in CheckST:', error);
            throw error; // หรือ return { type: 'error', message: error.message };
        }
    }

    static async findUser(user_national_id) {
        const [rows] = await db.query('SELECT * FROM users WHERE user_national_id = ?', [user_national_id]);
        return rows;
    }

    static async createUser(user) {
        const { type, national_id, password, role_id } = user;
    
        // ดึงค่าวันที่ + เวลา ณ ปัจจุบัน
        const currentDate = new Date();
    
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // ดำเนินการ query การ insert
        const result = await db.query(
            'INSERT INTO users (user_national_id, password, created_at, staff_created, updated_at, staff_updated) VALUES (?, ?, ?, ?, ?, ?)',
            [national_id, hashedPassword, currentDate, 'admin', currentDate, 'admin']
        );

        const [queryUser] = await db.query(
            'SELECT id FROM users WHERE user_national_id = ?',
            [national_id]
        );

        const [queryRoleStatus1] = await db.query(
            'SELECT id FROM roles WHERE id = ?',
            [role_id]
        )

        const [queryRoleStatus2] = await db.query(
            'SELECT id FROM roles WHERE role_name = ?',
            [type]
        )

        let addUserRoles = [];
        if(queryRoleStatus1[0].id !== queryRoleStatus2[0].id) {
            const rolesToAdd = [
                queryRoleStatus1[0].id,
                queryRoleStatus2[0].id
            ]

            for(const role of rolesToAdd) {
                const result = await db.query(
                    'INSERT INTO user_roles(user_id, role_id, assigned_by) VALUES (?, ?, ?)',
                    [queryUser[0].id, role, 'admin']
                );
                addUserRoles.push(result);
            }
        } else {
            const result = await db.query(
                'INSERT INTO user_roles(user_id, role_id, assigned_by) VALUES (?, ?, ?)',
                [queryUser[0].id, role_id, 'admin']
            )
            addUserRoles.push(result);
        }        

        return addUserRoles[0];
    }
    // Register End

    // Login Start
    // static async findUserById(id) { // เพิ่ม function นี้
    //     try {
    //         const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    //         return rows[0];
    //     } catch (error) {
    //         console.error("Error in findUserById:", error);
    //         throw error; // Re-throw error for handling in calling function
    //     }
    // }

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
        const [rows] = await db.query(
            'SELECT * FROM users WHERE user_national_id = ?', 
            [user_national_id]
        );
        
        if (rows.length > 0) {
            const user = rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return user;  // คืนค่าผู้ใช้เมื่อรหัสผ่านถูกต้อง
            }
        }
        return null;  // คืนค่า null ถ้ารหัสผ่านไม่ตรง
    }
    
    static async checkUserRole(existingPassword) {
        try {
            // ดึง user_id, role_id และ role_name ทั้งหมดของผู้ใช้
            const [user_roles] = await db.query(
                'SELECT ur.user_id, ur.role_id, r.role_name FROM user_roles ur LEFT JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = ?',
                [existingPassword.id]
            );
    
            if (user_roles.length === 0) {
                return { message: 'ไม่พบข้อมูล user_role!' };
            }
    
            // ดึงข้อมูล role และ user_id
            const roles = user_roles.map(role => role.role_name);
            return roles;
            
        } catch (error) {
            console.error('Error in checkUserRole:', error);
            return { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' };
        }
    }   
    
    static async LCheckST(existingPassword) {
        try {
            const [student] = await db.query(
                'SELECT prefix_name, fname, lname FROM students s INNER JOIN prefixes p ON s.prefix_id = p.id WHERE s.national_id = ?',
                [existingPassword.user_national_id]
            );
            if(student.length > 0) {
                return { type: 'student', data: student[0] };
            } 
    
            const [teacher] = await db.query(
                'SELECT prefix_name, fname, lname FROM teachers t INNER JOIN prefixes p ON t.prefix_id = p.id WHERE t.national_id = ?',
                [existingPassword.user_national_id]
            );
            if(teacher.length > 0) {
                return { type: 'teacher', data: teacher[0] };
            }

            return null;
    
        }catch(err) {
            console.error('Error in LChechST:', error);
            return { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' };
        }
    }
    // Login End
    
}

module.exports = User;
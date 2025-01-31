const db = require('../config/db');

class Teacher {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM teachers');
        return rows;
    }
}

module.exports = Teacher;
require('dotenv').config({ path: './src/.env' });
const mysql = require('mysql2');

// if (dotenv.error) {
//     console.error('Error loading .env file:', dotenv.error);
// } else {
//     console.log('Environment variables loaded:', dotenv.parsed);
// }

// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASS:', process.env.DB_PASS);
// console.log('DB_PORT:', process.env.DB_PORT);
// console.log('DB_NAME:', process.env.DB_NAME);

const connection = mysql.createConnection({
    // host: 'localhost',
    // user: 'root',
    // password: 'taza1996',
    // database: 'atech_vocational_college',
    // port: '1123',
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    // waitForConnection: true,
    // connectionLimit: 10,
    // queueLimit: 0
});

module.exports = connection.promise();
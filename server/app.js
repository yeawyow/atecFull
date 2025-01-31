const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const teacherRoutes = require('./src/routes/teacherRoutes');
const userRoutes = require('./src/routes/userRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());

// Route
app.use('/api', teacherRoutes);
app.use('/auth', userRoutes);

module.exports = app;
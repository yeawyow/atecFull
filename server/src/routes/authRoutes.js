const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const authStudents = require('../middleware/authStudents');
const authTeachers = require('../middleware/authTeachers');
const verify_front = require('../middleware/verify_front');

router.post('/register', auth, authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get('/profile', auth, authController.profile);

router.get('/check_token', async (req, res) => {
    const isValidToken = await verify_front(req);
    if (isValidToken) {
        res.status(200).json({ valid: true });
    } else {
        res.status(401).json({ valid: false });
    }
});

router.get('/profileStudent', authStudents, authController.profileStudent)
router.get('/profileTeacher', authTeachers, authController.profileTeacher)

// ตัว Check Token ที่อยู่ใน blacklist
router.get('/check_token_blacklist', authController.check_token_blacklist);

module.exports = router;
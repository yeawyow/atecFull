const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const verify_front = require('../middleware/verify_front');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.get('/profile', auth, userController.profile);

router.get('/check_token', async (req, res) => {
    const isValidToken = await verify_front(req);
    if (isValidToken) {
        res.status(200).json({ valid: true });
    } else {
        res.status(401).json({ valid: false });
    }
});

// ตัว Check Token ที่อยู่ใน blacklist
router.get('/check_token_blacklist', userController.check_token_blacklist);

module.exports = router;
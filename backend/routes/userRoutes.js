const express = require('express');
const authMiddleware = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();


router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/profile', authMiddleware, userController.getCurrentUser);
router.put('/profile', authMiddleware, userController.updateProfile);

module.exports = router;

const express = require('express');
const { signup, login, logout } = require('../controllers/auth-controllers');
const { authenticate } = require('../middlewares/auth-middleware');

const router = express.Router();

router.post('/signup', signup)

// - Multiple Login strategy:
router.post('/login', login)

// - Logout from current device: The logout strategy is such that if you have logged in from multiple devices, you 
// only want to logout per currently used device
router.post('/logout', authenticate, logout)

// - Logout from all devices
router.post('/logoutAll', authenticate, logout)

module.exports = router;
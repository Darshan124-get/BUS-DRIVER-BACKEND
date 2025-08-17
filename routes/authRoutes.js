const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login - Login with vehicle number
router.post('/login', authController.login);

// GET /api/auth/bus/:vehicleNumber - Get bus information
router.get('/bus/:vehicleNumber', authController.getBusInfo);

module.exports = router;

const express = require('express');
const historyController = require('../controllers/historyController');

const router = express.Router();

// GET trip history for a vehicle number
router.get('/get-trip-history', historyController.getTripHistory);

// POST save trip history
router.post('/save-trip-history', historyController.saveTripHistory);

module.exports = router;
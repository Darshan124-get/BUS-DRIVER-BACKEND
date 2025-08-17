const express = require('express');
const tripController = require('../controllers/tripController');

const router = express.Router();

// GET assigned trip for a vehicle number
router.get('/assigned-trip', tripController.getAssignedTrip);

// POST seed bus assignments (for testing)
router.post('/seed-bus-assignments', tripController.seedBusAssignments);

module.exports = router;
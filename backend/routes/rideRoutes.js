const express = require('express');
const authMiddleware = require('../middleware/auth');
const rideController = require('../controllers/rideController');

const router = express.Router();

router.get('/', rideController.getAllRides);
router.get('/:id', rideController.getRideById);

router.post('/', authMiddleware, rideController.createRide);
router.put('/:id', authMiddleware, rideController.updateRide);
router.delete('/:id', authMiddleware, rideController.deleteRide);
router.post('/book', authMiddleware, rideController.bookRide);
router.get('/bookings/my-bookings', authMiddleware, rideController.getUserBookings);

module.exports = router;

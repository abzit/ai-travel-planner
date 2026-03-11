const express = require('express');
const router = express.Router();
const {
  generateTrip,
  generateGuestTrip,
  getUserTrips,
  getTripById,
  addActivity,
  removeActivity,
  regenerateTripDay
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate-guest', generateGuestTrip);
router.post('/generate', protect, generateTrip);
router.get('/my-trips', protect, getUserTrips);
router.get('/:tripId', protect, getTripById);
router.patch('/:tripId/add-activity', protect, addActivity);
router.delete('/:tripId/remove-activity', protect, removeActivity);
router.post('/:tripId/regenerate-day', protect, regenerateTripDay);

module.exports = router;


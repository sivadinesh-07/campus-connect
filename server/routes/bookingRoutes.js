const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getMyBookings,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking).get(protect, admin, getBookings);
router.route('/my').get(protect, getMyBookings);
router.route('/:id/status').put(protect, admin, updateBookingStatus);
router.route('/:id').delete(protect, admin, deleteBooking);

module.exports = router;

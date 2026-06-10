const express = require('express');
const router = express.Router();
const { createEvent, getEvents, deleteEvent } = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, createEvent).get(protect, getEvents);
router.route('/:id').delete(protect, admin, deleteEvent);

module.exports = router;

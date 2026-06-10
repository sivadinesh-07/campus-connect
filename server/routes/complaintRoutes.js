const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getMyComplaints,
  updateComplaint,
} = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createComplaint).get(protect, admin, getComplaints);
router.route('/my').get(protect, getMyComplaints);
router.route('/:id').put(protect, admin, updateComplaint);

module.exports = router;

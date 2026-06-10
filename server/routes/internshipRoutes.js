const express = require('express');
const router = express.Router();
const {
  createInternship,
  getInternships,
  deleteInternship,
} = require('../controllers/internshipController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, createInternship).get(protect, getInternships);
router.route('/:id').delete(protect, admin, deleteInternship);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  reportLostItem,
  getItems,
  markAsFound,
  deleteItem,
} = require('../controllers/lostFoundController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/').post(protect, upload.single('image'), reportLostItem).get(protect, getItems);
router.route('/:id').delete(protect, deleteItem);
router.route('/:id/found').put(protect, markAsFound);

module.exports = router;

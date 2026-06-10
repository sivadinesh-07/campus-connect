const LostItem = require('../models/LostItem');

// @desc    Report a lost item
// @route   POST /api/lost-found
// @access  Private
const reportLostItem = async (req, res) => {
  try {
    const { title, description } = req.body;
    const item = new LostItem({
      title,
      description,
      reportedBy: req.user._id,
      image: req.file ? req.file.path : '',
    });
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all lost/found items
// @route   GET /api/lost-found
// @access  Private
const getItems = async (req, res) => {
  try {
    const items = await LostItem.find({}).populate('reportedBy', 'name');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark item as found
// @route   PUT /api/lost-found/:id/found
// @access  Private
const markAsFound = async (req, res) => {
  try {
    const { foundLocation } = req.body;
    const item = await LostItem.findById(req.params.id);

    if (item) {
      item.status = 'found';
      item.foundLocation = foundLocation;
      item.foundBy = req.user._id;
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fs = require('fs');
const path = require('path');

// @desc    Delete a lost/found item
// @route   DELETE /api/lost-found/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if the user is the owner or an admin
    if (item.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Delete the image file if it exists
    if (item.image) {
      const imagePath = path.join(__dirname, '..', item.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image file:', err);
      });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { reportLostItem, getItems, markAsFound, deleteItem };

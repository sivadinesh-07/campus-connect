const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['lost', 'found'],
    default: 'lost',
  },
  foundLocation: {
    type: String,
    default: '',
  },
  foundBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  image: {
    type: String,
    default: '',
  }
}, {
  timestamps: true,
});

const LostItem = mongoose.model('LostItem', lostItemSchema);
module.exports = LostItem;

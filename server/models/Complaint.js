const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'solved'],
    default: 'pending',
  },
  response: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;

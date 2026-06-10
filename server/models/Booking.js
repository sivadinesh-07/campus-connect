const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  resourceName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['classroom', 'resource'],
    required: true,
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;

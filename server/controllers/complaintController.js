const Complaint = require('../models/Complaint');

// @desc    Raise a new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;
    const complaint = new Complaint({
      title,
      description,
      raisedBy: req.user._id,
    });
    const createdComplaint = await complaint.save();
    res.status(201).json(createdComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ALL complaints
// @route   GET /api/complaints
// @access  Private/Admin
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({}).populate('raisedBy', 'name email');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's complaints
// @route   GET /api/complaints/my
// @access  Private
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ raisedBy: req.user._id });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status/response
// @route   PUT /api/complaints/:id
// @access  Private/Admin
const updateComplaint = async (req, res) => {
  try {
    const { status, response } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (response !== undefined) updateFields.response = response;

    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('raisedBy', 'name email');

    if (!updated) return res.status(404).json({ message: 'Complaint not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createComplaint, getComplaints, getMyComplaints, updateComplaint };

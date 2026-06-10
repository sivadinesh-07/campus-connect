const Internship = require('../models/Internship');

// @desc    Post an internship
// @route   POST /api/internships
// @access  Private/Admin
const createInternship = async (req, res) => {
  try {
    const { title, company, description, applyLink } = req.body;
    const internship = new Internship({
      title,
      company,
      description,
      applyLink,
      postedBy: req.user._id,
    });
    const createdInternship = await internship.save();
    res.status(201).json(createdInternship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all internships
// @route   GET /api/internships
// @access  Public (or Private depending on needs)
const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find({}).sort({ createdAt: -1 });
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an internship
// @route   DELETE /api/internships/:id
// @access  Private/Admin
const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    await internship.deleteOne();
    res.json({ message: 'Internship removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createInternship, getInternships, deleteInternship };

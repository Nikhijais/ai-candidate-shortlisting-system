const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  skills: [{
    type: String,
    required: true,
  }],
  experience: {
    type: Number,
    required: true, // in years
  },
  projectsBio: {
    type: String,
    required: true,
  },
  // We can optionally store match info if we want to save shortlisted states later
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);

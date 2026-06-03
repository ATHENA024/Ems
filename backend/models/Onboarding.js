const mongoose = require('mongoose');

const onboardingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, default: '' },
  dept: { type: String, default: '' },
  startDate: { type: String, default: '' },
  progress: { type: Number, default: 0 },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
}, { timestamps: true });

module.exports = mongoose.model('Onboarding', onboardingSchema);

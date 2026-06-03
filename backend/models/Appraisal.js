const mongoose = require('mongoose');

const appraisalSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  empName: { type: String },
  empDept: { type: String },
  empPosition: { type: String },
  quarter: { type: String, default: 'Q1' },
  year: { type: Number },
  scores: {
    technical: { type: Number, default: 3 },
    communication: { type: Number, default: 3 },
    teamwork: { type: Number, default: 3 },
    punctuality: { type: Number, default: 3 },
    productivity: { type: Number, default: 3 },
  },
  average: { type: Number, default: 0 },
  rating: { type: String, default: '' },
  comments: { type: String, default: '' },
  date: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Appraisal', appraisalSchema);

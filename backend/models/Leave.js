const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  empName: { type: String },
  department: { type: String },
  type: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  days: { type: Number, default: 1 },
  reason: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  appliedOn: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);

const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  empName: { type: String },
  month: { type: String, required: true },
  annualSalary: { type: Number, required: true },
  basic: Number, hra: Number, da: Number, otherAllowances: Number,
  pf: Number, monthlyTds: Number,
  monthlyNet: Number,
  payMode: { type: String, default: 'Bank Transfer' },
  paidDate: { type: String, default: '' },
  status: { type: String, enum: ['Paid', 'Pending'], default: 'Paid' },
}, { timestamps: true });

payrollSchema.index({ employee: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Payroll', payrollSchema);

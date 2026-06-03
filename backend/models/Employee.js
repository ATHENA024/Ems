const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  department: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
  shift: { type: String, enum: ['Morning', 'Evening', 'Night'], default: 'Morning' },
  joinDate: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  avatar: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);

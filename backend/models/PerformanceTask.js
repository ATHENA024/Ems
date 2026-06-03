const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  empName: { type: String },
  empDept: { type: String },
  title: { type: String, required: true },
  desc: { type: String, default: '' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  dueDate: { type: String, default: '' },
  status: { type: String, enum: ['Assigned', 'In Progress', 'Completed', 'Cancelled'], default: 'Assigned' },
  assignedDate: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('PerformanceTask', taskSchema);

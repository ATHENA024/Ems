const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'Technical' },
  empName: { type: String, default: '' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
  date: { type: String, default: '' },
  desc: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);

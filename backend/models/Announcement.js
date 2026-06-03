const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'Admin' },
  dept: { type: String, default: 'All' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  date: { type: String, default: '' },
  comments: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);

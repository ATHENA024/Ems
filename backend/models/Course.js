const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'Technology' },
  duration: { type: String, default: '' },
  lessons: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
  enrolled: { type: Boolean, default: false },
  image: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);

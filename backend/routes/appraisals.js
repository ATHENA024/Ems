const express = require('express');
const router = express.Router();
const Appraisal = require('../models/Appraisal');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { empId } = req.query;
    const filter = {};
    if (empId) filter.employee = empId;
    const reviews = await Appraisal.find(filter).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { scores } = req.body;
    const vals = Object.values(scores);
    const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10;
    let rating = 'Needs Improvement';
    if (avg >= 4.5) rating = 'Excellent';
    else if (avg >= 3.5) rating = 'Good';
    else if (avg >= 2.5) rating = 'Average';
    const review = new Appraisal({ ...req.body, average: avg, rating });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const review = await Appraisal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Appraisal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

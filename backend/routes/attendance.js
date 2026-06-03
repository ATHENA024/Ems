const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { empId } = req.query;
    const filter = {};
    if (empId) filter.employee = empId;
    const records = await Attendance.find(filter).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { employee, empName, date, checkIn, checkOut } = req.body;
    const existing = await Attendance.findOne({ employee, date });
    if (existing) {
      existing.checkOut = checkOut || existing.checkOut;
      existing.empName = empName || existing.empName;
      await existing.save();
      return res.json(existing);
    }
    const record = new Attendance({ employee, empName, date, checkIn, checkOut });
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

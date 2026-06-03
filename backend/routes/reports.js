const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Payroll = require('../models/Payroll');
const Leave = require('../models/Leave');
const { auth } = require('../middleware/auth');

router.get('/summary', auth, async (req, res) => {
  try {
    const total = await Employee.countDocuments();
    const active = await Employee.countDocuments({ status: 'Active' });
    const inactive = await Employee.countDocuments({ status: 'Inactive' });
    const deptData = await Employee.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);
    const departments = deptData.map(d => ({ name: d._id, count: d.count }));
    const leaves = await Leave.find();
    const payroll = await Payroll.find();
    res.json({ totalEmployees: total, activeEmployees: active, inactiveEmployees: inactive, departments, leaves, payroll });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/employee/:empId', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.empId);
    if (!employee) return res.status(404).json({ message: 'Not found' });
    const attendance = await Attendance.find({ employee: req.params.empId });
    const leaves = await Leave.find({ employee: req.params.empId });
    const payslips = await Payroll.find({ employee: req.params.empId });
    res.json({ employee, attendance, leaves, payslips });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

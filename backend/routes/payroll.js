const express = require('express');
const router = express.Router();
const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { empId } = req.query;
    const filter = {};
    if (empId) filter.employee = empId;
    const records = await Payroll.find(filter).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { employee, empName, month, annualSalary } = req.body;
    const basic = Math.round(annualSalary * 0.5 / 12);
    const hra = Math.round(annualSalary * 0.2 / 12);
    const da = Math.round(annualSalary * 0.1 / 12);
    const otherAllowances = Math.round(annualSalary * 0.2 / 12);
    const pf = Math.round(basic * 0.12);
    const tds = annualSalary * 0.05;
    const monthlyTds = Math.round(tds / 12);
    const monthlyNet = basic + hra + da + otherAllowances - pf - monthlyTds;
    const existing = await Payroll.findOne({ employee, month });
    if (existing) {
      Object.assign(existing, { empName, annualSalary, basic, hra, da, otherAllowances, pf, monthlyTds, monthlyNet, ...req.body });
      await existing.save();
      return res.json(existing);
    }
    const payroll = new Payroll({
      employee, empName, month, annualSalary,
      basic, hra, da, otherAllowances, pf, monthlyTds, monthlyNet,
      payMode: 'Bank Transfer', status: 'Paid',
      paidDate: req.body.paidDate || new Date().toISOString().split('T')[0],
    });
    await payroll.save();
    res.status(201).json(payroll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/calculate/:empId', auth, async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.empId);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    const annualSalary = emp.salary;
    const basic = Math.round(annualSalary * 0.5 / 12);
    const hra = Math.round(annualSalary * 0.2 / 12);
    const da = Math.round(annualSalary * 0.1 / 12);
    const otherAllowances = Math.round(annualSalary * 0.2 / 12);
    const pf = Math.round(basic * 0.12);
    const tds = annualSalary * 0.05;
    const monthlyTds = Math.round(tds / 12);
    const monthlyNet = basic + hra + da + otherAllowances - pf - monthlyTds;
    res.json({ annualSalary, basic, hra, da, otherAllowances, pf, monthlyTds, monthlyNet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

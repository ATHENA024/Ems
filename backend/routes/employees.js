const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { auth, adminOnly, sectionAdminOrAdminOnly, hasPermission } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'section_admin') {
      query.department = req.user.department;
    }
    const employees = await Employee.find(query).sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    if (req.user.role === 'section_admin' && emp.department !== req.user.department) {
      return res.status(403).json({ message: 'Access denied: not your department' });
    }
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, sectionAdminOrAdminOnly, hasPermission('add_employee'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.user.role === 'section_admin') {
      data.department = req.user.department;
    }
    const emp = new Employee(data);
    await emp.save();
    res.status(201).json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, sectionAdminOrAdminOnly, hasPermission('edit_employee'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.user.role === 'section_admin') {
      const existing = await Employee.findById(req.params.id);
      if (!existing) return res.status(404).json({ message: 'Employee not found' });
      if (existing.department !== req.user.department) {
        return res.status(403).json({ message: 'Access denied: not your department' });
      }
      data.department = req.user.department;
    }
    const emp = await Employee.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

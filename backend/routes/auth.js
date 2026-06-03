const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Employee = require('../models/Employee');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username, role: user.role, name: user.name, department: user.department, permissions: user.permissions },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({
      token,
      user: { id: user._id, email: user.email, username: user.username, name: user.name, role: user.role, department: user.department, permissions: user.permissions, avatar: user.avatar }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/register', auth, adminOnly, async (req, res) => {
  try {
    const { email, password, name, role, department, permissions, employeeData } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const user = new User({
      email: email.toLowerCase(),
      username: email.split('@')[0],
      password,
      name,
      role: role || 'employee',
      department: department || '',
      permissions: permissions || [],
    });
    await user.save();
    if (employeeData) {
      const emp = new Employee({
        firstName: employeeData.firstName || name.split(' ')[0],
        lastName: employeeData.lastName || name.split(' ').slice(1).join(' '),
        email: email.toLowerCase(),
        phone: employeeData.phone || '',
        department: department || employeeData.department || '',
        position: employeeData.position || '',
        salary: employeeData.salary || 0,
        shift: employeeData.shift || 'Morning',
        joinDate: employeeData.joinDate || new Date().toISOString().split('T')[0],
        status: 'Active',
      });
      await emp.save();
    }
    res.status(201).json({ id: user._id, email: user.email, name: user.name, role: user.role, department: user.department });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (req.body.name) user.name = req.body.name;
    if (req.body.username) user.username = req.body.username;
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
    if (req.body.department !== undefined) user.department = req.body.department;
    if (req.body.permissions !== undefined && req.user.role === 'admin') user.permissions = req.body.permissions;
    await user.save();
    res.json({ id: user._id, email: user.email, username: user.username, name: user.name, role: user.role, department: user.department, permissions: user.permissions, avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user._id, email: user.email, username: user.username, name: user.name, role: user.role, department: user.department, permissions: user.permissions, avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

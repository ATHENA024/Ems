import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEmployeeContext } from '../context/EmployeeContext';
import './Login.css';

function EmployeeRegister() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    department: '', position: '', phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addEmployee } = useEmployeeContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.email || !form.password) {
      setError('Name, email and password are required');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        email: form.email,
        password: form.password,
        name: form.name,
        role: 'employee',
        department: form.department,
        position: form.position,
        phone: form.phone,
      });

      const nameParts = form.name.trim().split(/\s+/);
      addEmployee({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: form.email,
        phone: form.phone || '',
        department: form.department || '',
        position: form.position || '',
        salary: 0,
        shift: 'Morning',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        avatar: `https://i.pravatar.cc/150?u=${form.email.replace('@', '-')}`,
      });

      const empId = result?.employeeId || '';
      setSuccess(`Account created! Your Employee ID: ${empId}. You can now login.`);
      setTimeout(() => navigate('/employee/login'), 3000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-shape login-bg-shape-1"></div>
      <div className="login-bg-shape login-bg-shape-2"></div>
      <div className="login-bg-shape login-bg-shape-3"></div>
      <div className="login-card" style={{ maxWidth: 500 }}>
        <div className="login-logo">
          <div className="login-logo-icon emp-logo">E</div>
        </div>

        <div className="login-header">
          <h1>Employee Registration</h1>
          <p>Create your employee account</p>
        </div>

        {error && (
          <div className="login-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="login-success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Full Name *</label>
            <div className="input-wrapper">
              <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="John Doe" required autoFocus />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="employee@company.com" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Password *</label>
              <div className="input-wrapper">
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 6 chars" required />
              </div>
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <div className="input-wrapper">
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter" required />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Department</label>
              <div className="input-wrapper">
                <select name="department" value={form.department} onChange={handleChange}>
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Sales">Sales</option>
                  <option value="Design">Design</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Position</label>
              <div className="input-wrapper">
                <input name="position" type="text" value={form.position} onChange={handleChange} placeholder="e.g. Developer" />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Phone</label>
            <div className="input-wrapper">
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="9876543210" />
            </div>
          </div>

          <button type="submit" className="login-btn emp-btn" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? (
              <span className="login-btn-loading">
                <span className="spinner"></span>
                Creating account...
              </span>
            ) : (
              'Create Employee Account'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Already have an account? <Link to="/employee/login">Sign in</Link></p>
        </div>

        <div className="login-back-link">
          <Link to="/register">Admin Registration</Link>
        </div>
      </div>
    </div>
  );
}

export default EmployeeRegister;

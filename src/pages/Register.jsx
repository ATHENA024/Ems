import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEmployeeContext } from '../context/EmployeeContext';
import './Login.css';

function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    department: '', position: '', phone: '',
  });
  const [role, setRole] = useState('employee');
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
        role,
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
      setSuccess(`Account created! Your Employee ID: ${empId}. Redirecting to login...`);
      setTimeout(() => navigate('/login'), 3000);
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
      <div className="login-bg-shape login-bg-shape-4"></div>
      <div className="login-card" style={{ maxWidth: 500 }}>
        <div className="login-logo">
          <div className="login-logo-icon">EMS</div>
        </div>

        <div className="login-header">
          <h1>Create Account</h1>
          <p>Register as a new user</p>
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
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@company.com" required />
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

          <div className="form-group">
            <label>Account Type</label>
            <div className="role-selector">
              <button
                type="button"
                className={`role-option ${role === 'employee' ? 'active' : ''}`}
                onClick={() => setRole('employee')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Employee</span>
              </button>
              <button
                type="button"
                className={`role-option ${role === 'admin' ? 'active' : ''}`}
                onClick={() => setRole('admin')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Admin</span>
              </button>
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

          <button type="submit" className="login-btn" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? (
              <span className="login-btn-loading">
                <span className="spinner"></span>
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>

        <div className="login-back-link">
          <Link to="/employee/register">Employee Registration</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;

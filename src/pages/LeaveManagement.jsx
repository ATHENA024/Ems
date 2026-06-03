import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmployeeContext } from '../context/EmployeeContext';
import './LeaveManagement.css';

const leaveTypes = ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Personal Leave', 'Maternity Leave', 'Paternity Leave'];

const defaultBalances = {
  'Sick Leave': 12, 'Casual Leave': 10, 'Annual Leave': 20, 'Personal Leave': 5, 'Maternity Leave': 84, 'Paternity Leave': 15,
};

function calcDays(from, to) {
  const f = new Date(from), t = new Date(to);
  return Math.max(1, Math.round((t - f) / (1000 * 60 * 60 * 24)) + 1);
}

function LeaveManagement() {
  const { user } = useAuth();
  const { employees } = useEmployeeContext();
  const isAdmin = user?.role === 'admin';

  const empName = isAdmin ? '' : `${employees.find(e => e.email === user?.email)?.firstName || ''} ${employees.find(e => e.email === user?.email)?.lastName || ''}`.trim();

  const [leaves, setLeaves] = useState(() => {
    const saved = localStorage.getItem('leaveRequests');
    return saved ? JSON.parse(saved) : [
      { id: 1, empId: 4, empName: 'Sneha Patel', department: 'HR', type: 'Sick Leave', from: '2026-06-10', to: '2026-06-11', days: 2, reason: 'Not feeling well', status: 'Approved', appliedOn: '2026-06-08' },
      { id: 2, empId: 7, empName: 'Arjun Nair', department: 'Engineering', type: 'Annual Leave', from: '2026-06-15', to: '2026-06-19', days: 5, reason: 'Family vacation', status: 'Pending', appliedOn: '2026-06-09' },
      { id: 3, empId: 3, empName: 'Amit Singh', department: 'Engineering', type: 'Personal Leave', from: '2026-06-12', to: '2026-06-12', days: 1, reason: 'Personal work', status: 'Pending', appliedOn: '2026-06-10' },
      { id: 4, empId: 8, empName: 'Divya Joshi', department: 'Sales', type: 'Casual Leave', from: '2026-06-18', to: '2026-06-18', days: 1, reason: 'Family function', status: 'Rejected', appliedOn: '2026-06-11' },
    ];
  });

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ empId: '', type: 'Sick Leave', from: '', to: '', reason: '' });

  const visibleLeaves = isAdmin ? leaves : leaves.filter(l => l.empName === empName || l.empName === user?.name);

  const handleApply = (e) => {
    e.preventDefault();
    if (!form.from || !form.to || !form.reason) return;
    const emp = isAdmin
      ? employees.find((e) => e.id === parseInt(form.empId))
      : employees.find((e) => e.email === user?.email);
    if (!emp) return;
    const days = calcDays(form.from, form.to);
    const leaf = {
      id: Date.now(),
      empId: emp.id,
      empName: `${emp.firstName} ${emp.lastName}`,
      department: emp.department || '',
      type: form.type,
      from: form.from,
      to: form.to,
      days,
      reason: form.reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };
    const updated = [...leaves, leaf];
    setLeaves(updated);
    localStorage.setItem('leaveRequests', JSON.stringify(updated));
    setForm({ empId: '', type: 'Sick Leave', from: '', to: '', reason: '' });
    setShowForm(false);
  };

  const handleAction = (id, status) => {
    const updated = leaves.map((l) => l.id === id ? { ...l, status } : l);
    setLeaves(updated);
    localStorage.setItem('leaveRequests', JSON.stringify(updated));
  };

  const filtered = filter === 'all' ? visibleLeaves : visibleLeaves.filter((l) => l.status.toLowerCase() === filter);
  const pending = visibleLeaves.filter((l) => l.status === 'Pending').length;
  const approved = visibleLeaves.filter((l) => l.status === 'Approved').length;
  const rejected = visibleLeaves.filter((l) => l.status === 'Rejected').length;

  return (
    <div className="leave-page">
      <div className="page-header">
        <h1>Leave Management</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          {isAdmin ? '+ Generate Leave' : '+ Apply Leave'}
        </button>
      </div>

      <div className="leave-summary">
        <div className="card leave-summary-card">
          <div className="leave-summary-icon" style={{ background: '#eef2ff', color: '#6366f1' }}>📋</div>
          <div><div className="leave-summary-val">{visibleLeaves.length}</div><div className="leave-summary-lbl">Total Requests</div></div>
        </div>
        <div className="card leave-summary-card" onClick={() => setFilter('pending')} style={{ cursor: 'pointer', border: filter === 'pending' ? '2px solid #f59e0b' : 'none' }}>
          <div className="leave-summary-icon" style={{ background: '#fef7e0', color: '#f59e0b' }}>⏳</div>
          <div><div className="leave-summary-val">{pending}</div><div className="leave-summary-lbl">Pending</div></div>
        </div>
        <div className="card leave-summary-card" onClick={() => setFilter('approved')} style={{ cursor: 'pointer', border: filter === 'approved' ? '2px solid #0f9d58' : 'none' }}>
          <div className="leave-summary-icon" style={{ background: '#e6f4ea', color: '#0f9d58' }}>✅</div>
          <div><div className="leave-summary-val">{approved}</div><div className="leave-summary-lbl">Approved</div></div>
        </div>
        <div className="card leave-summary-card" onClick={() => setFilter('rejected')} style={{ cursor: 'pointer', border: filter === 'rejected' ? '2px solid #dc2626' : 'none' }}>
          <div className="leave-summary-icon" style={{ background: '#fce8e6', color: '#dc2626' }}>❌</div>
          <div><div className="leave-summary-val">{rejected}</div><div className="leave-summary-lbl">Rejected</div></div>
        </div>
      </div>

      <div className="leave-grid">
        <div className="card" style={{ flex: 2, padding: 20 }}>
          <div className="leave-tabs">
            <button className={`leave-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All ({visibleLeaves.length})</button>
            <button className={`leave-tab ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Pending ({pending})</button>
            <button className={`leave-tab ${filter === 'approved' ? 'active' : ''}`} onClick={() => setFilter('approved')}>Approved ({approved})</button>
            <button className={`leave-tab ${filter === 'rejected' ? 'active' : ''}`} onClick={() => setFilter('rejected')}>Rejected ({rejected})</button>
          </div>

          <div className="leave-list">
            {filtered.length === 0 && (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: 32 }}>No {filter === 'all' ? '' : filter} leave requests</p>
            )}
            {filtered.map((l) => (
              <div key={l.id} className={`leave-card ${l.status.toLowerCase()}`}>
                <div className="leave-card-top">
                  <div className="leave-card-user">
                    <img src={`https://ui-avatars.com/api/?name=${l.empName.replace(' ', '+')}&background=6366f1&color=fff&size=36`} alt="" />
                    <div>
                      <div className="leave-card-name">{l.empName}</div>
                      <div className="leave-card-dept">{l.department} • {l.type}</div>
                    </div>
                  </div>
                  <span className={`badge badge-${l.status === 'Approved' ? 'success' : l.status === 'Rejected' ? 'danger' : 'warning'}`}>{l.status}</span>
                </div>
                <div className="leave-card-dates">
                  <div className="leave-date-box">
                    <span className="leave-date-lbl">From</span>
                    <span className="leave-date-val">{new Date(l.from).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <span className="leave-date-arrow">→</span>
                  <div className="leave-date-box">
                    <span className="leave-date-lbl">To</span>
                    <span className="leave-date-val">{new Date(l.to).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="leave-date-box" style={{ marginLeft: 'auto', textAlign: 'center' }}>
                    <span className="leave-date-lbl">Days</span>
                    <span className="leave-days">{l.days}</span>
                  </div>
                </div>
                <div className="leave-card-reason">"{l.reason}"</div>
                <div className="leave-card-bottom">
                  <span className="leave-card-applied">Applied: {new Date(l.appliedOn).toLocaleDateString('en-IN')}</span>
                  {l.status === 'Pending' && isAdmin && (
                    <div className="leave-card-actions">
                      <button className="btn btn-success" style={{ padding: '6px 16px', fontSize: 12 }} onClick={() => handleAction(l.id, 'Approved')}>Approve</button>
                      <button className="btn btn-danger" style={{ padding: '6px 16px', fontSize: 12 }} onClick={() => handleAction(l.id, 'Rejected')}>Reject</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 className="leave-section-title">Leave Balance</h3>
            <div className="leave-balance-list">
              {leaveTypes.map((type) => (
                <div key={type} className="leave-balance-row">
                  <span className="leave-balance-type">{type}</span>
                  <span className="leave-balance-days">{defaultBalances[type]} days</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <h3 className="leave-section-title">Quick Stats</h3>
            <div className="leave-quick-stats">
              <div className="leave-qs-item">
                <div className="leave-qs-val" style={{ color: '#6366f1' }}>{visibleLeaves.reduce((s, l) => s + l.days, 0)}</div>
                <div className="leave-qs-lbl">Total Days</div>
              </div>
              <div className="leave-qs-item">
                <div className="leave-qs-val" style={{ color: '#0f9d58' }}>{approved}</div>
                <div className="leave-qs-lbl">Approved</div>
              </div>
              <div className="leave-qs-item">
                <div className="leave-qs-val" style={{ color: '#f59e0b' }}>{pending}</div>
                <div className="leave-qs-lbl">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <h2>{isAdmin ? 'Generate Leave for Employee' : 'Apply for Leave'}</h2>
            <form onSubmit={handleApply}>
              {isAdmin && (
                <div className="form-group">
                  <label>Employee</label>
                  <select value={form.empId} onChange={(e) => setForm((p) => ({ ...p, empId: e.target.value }))} required>
                    <option value="">Select Employee</option>
                    {employees
                      .filter(e => e.status !== 'Inactive')
                      .map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName} — {e.department || 'N/A'}</option>)}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>Leave Type</label>
                <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
                  {leaveTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>From Date</label>
                  <input type="date" value={form.from} onChange={(e) => setForm((p) => ({ ...p, from: e.target.value }))} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>To Date</label>
                  <input type="date" value={form.to} onChange={(e) => setForm((p) => ({ ...p, to: e.target.value }))} required />
                </div>
              </div>
              {form.from && form.to && (
                <div style={{ fontSize: 13, color: '#6366f1', fontWeight: 600, marginBottom: 12 }}>
                  Total: {calcDays(form.from, form.to)} day{calcDays(form.from, form.to) > 1 ? 's' : ''}
                </div>
              )}
              <div className="form-group">
                <label>Reason</label>
                <textarea rows="3" value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} placeholder="Enter reason for leave" required></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{isAdmin ? 'Generate Leave' : 'Submit Request'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveManagement;

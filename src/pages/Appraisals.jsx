import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Appraisals.css';

const employees = [
  { id: 1, name: 'Rahul Sharma', department: 'Engineering', position: 'Senior Developer', avatar: 'Rahul+Sharma' },
  { id: 2, name: 'Priya Verma', department: 'Marketing', position: 'Marketing Lead', avatar: 'Priya+Verma' },
  { id: 3, name: 'Amit Singh', department: 'Engineering', position: 'Full Stack Developer', avatar: 'Amit+Singh' },
  { id: 4, name: 'Sneha Patel', department: 'HR', position: 'HR Manager', avatar: 'Sneha+Patel' },
  { id: 5, name: 'Vikram Reddy', department: 'Finance', position: 'Accountant', avatar: 'Vikram+Reddy' },
  { id: 7, name: 'Arjun Nair', department: 'Engineering', position: 'DevOps Engineer', avatar: 'Arjun+Nair' },
  { id: 8, name: 'Divya Joshi', department: 'Sales', position: 'Sales Manager', avatar: 'Divya+Joshi' },
  { id: 9, name: 'Karan Mehta', department: 'Engineering', position: 'Frontend Developer', avatar: 'Karan+Mehta' },
  { id: 11, name: 'Rohit Desai', department: 'Finance', position: 'Financial Analyst', avatar: 'Rohit+Desai' },
  { id: 12, name: 'Neha Agarwal', department: 'Sales', position: 'Sales Executive', avatar: 'Neha+Agarwal' },
];

const currentYear = new Date().getFullYear();

function Appraisals() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('appraisals');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    empId: '', quarter: 'Q1', year: currentYear,
    technical: 3, communication: 3, teamwork: 3, punctuality: 3, productivity: 3,
    comments: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.empId) return;
    const emp = employees.find((e) => e.id === parseInt(form.empId));
    const avg = ((form.technical + form.communication + form.teamwork + form.punctuality + form.productivity) / 5).toFixed(1);
    const rating = avg >= 4.5 ? 'Outstanding' : avg >= 3.5 ? 'Excellent' : avg >= 2.5 ? 'Good' : avg >= 1.5 ? 'Average' : 'Needs Improvement';
    const review = {
      id: Date.now(),
      empId: parseInt(form.empId),
      empName: emp.name,
      empDept: emp.department,
      empPosition: emp.position,
      quarter: form.quarter,
      year: form.year,
      scores: { technical: form.technical, communication: form.communication, teamwork: form.teamwork, punctuality: form.punctuality, productivity: form.productivity },
      average: parseFloat(avg),
      rating,
      comments: form.comments,
      date: new Date().toLocaleDateString('en-IN'),
    };
    const updated = [...reviews, review];
    setReviews(updated);
    localStorage.setItem('appraisals', JSON.stringify(updated));
    setShowForm(false);
    setForm({ empId: '', quarter: 'Q1', year: currentYear, technical: 3, communication: 3, teamwork: 3, punctuality: 3, productivity: 3, comments: '' });
  };

  const ratingColors = { Outstanding: '#0f9d58', Excellent: '#6366f1', Good: '#f59e0b', Average: '#f97316', 'Needs Improvement': '#dc2626' };

  return (
    <div className="appr-page">
      <div className="page-header">
        <h1>Appraisals</h1>
        {user?.role === 'admin' && <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ New Review</button>}
      </div>

      <div className="appr-summary">
        <div className="card appr-summary-card"><div className="appr-summary-val" style={{ color: '#6366f1' }}>{reviews.length}</div><div className="appr-summary-lbl">Total Reviews</div></div>
        <div className="card appr-summary-card"><div className="appr-summary-val" style={{ color: '#0f9d58' }}>{reviews.filter((r) => r.rating === 'Outstanding' || r.rating === 'Excellent').length}</div><div className="appr-summary-lbl">Top Performers</div></div>
        <div className="card appr-summary-card"><div className="appr-summary-val" style={{ color: '#f59e0b' }}>{reviews.filter((r) => r.rating === 'Good' || r.rating === 'Average').length}</div><div className="appr-summary-lbl">Average</div></div>
        <div className="card appr-summary-card"><div className="appr-summary-val" style={{ color: '#dc2626' }}>{reviews.filter((r) => r.rating === 'Needs Improvement').length}</div><div className="appr-summary-lbl">Needs Improvement</div></div>
      </div>

      <div className="card">
        <h3 className="appr-section-title">Review History</h3>
        {reviews.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: 32 }}>No reviews conducted yet. Click "+ New Review" to start.</p>
        ) : (
          <div className="appr-list">
            {[...reviews].reverse().map((r) => (
              <div key={r.id} className="appr-card">
                <div className="appr-card-top">
                  <div className="appr-card-user">
                    <img src={`https://ui-avatars.com/api/?name=${r.empName.replace(' ', '+')}&background=6366f1&color=fff&size=36`} alt="" />
                    <div>
                      <div className="appr-card-name">{r.empName}</div>
                      <div className="appr-card-role">{r.empPosition} — {r.empDept}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="appr-card-rating" style={{ color: ratingColors[r.rating] }}>{r.rating}</div>
                    <div className="appr-card-score">{r.average}/5</div>
                  </div>
                </div>
                <div className="appr-card-meta">{r.quarter} {r.year} • Reviewed on {r.date}</div>
                <div className="appr-scores">
                  {Object.entries(r.scores).map(([key, val]) => (
                    <div key={key} className="appr-score-item">
                      <span className="appr-score-label">{key}</span>
                      <div className="appr-score-bar-bg">
                        <div className="appr-score-bar" style={{ width: `${(val / 5) * 100}%`, background: val >= 4 ? '#0f9d58' : val >= 3 ? '#6366f1' : val >= 2 ? '#f59e0b' : '#dc2626' }}></div>
                      </div>
                      <span className="appr-score-val">{val}/5</span>
                    </div>
                  ))}
                </div>
                {r.comments && <div className="appr-comments">"{r.comments}"</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <h2>New Performance Review</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Employee</label>
                <select value={form.empId} onChange={(e) => setForm((p) => ({ ...p, empId: e.target.value }))} required>
                  <option value="">Select Employee</option>
                  {employees.map((e) => <option key={e.id} value={e.id}>{e.name} — {e.department}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Quarter</label>
                  <select value={form.quarter} onChange={(e) => setForm((p) => ({ ...p, quarter: e.target.value }))}>
                    <option>Q1</option><option>Q2</option><option>Q3</option><option>Q4</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Year</label>
                  <input type="number" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} />
                </div>
              </div>
              <div className="appr-form-scores">
                {['technical', 'communication', 'teamwork', 'punctuality', 'productivity'].map((s) => (
                  <div key={s} className="appr-form-score">
                    <label>{s.charAt(0).toUpperCase() + s.slice(1)}</label>
                    <div className="appr-form-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`appr-star ${form[s] >= star ? 'active' : ''}`} onClick={() => setForm((p) => ({ ...p, [s]: star }))}>★</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label>Comments</label>
                <textarea rows="2" value={form.comments} onChange={(e) => setForm((p) => ({ ...p, comments: e.target.value }))} placeholder="Additional feedback..." />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appraisals;

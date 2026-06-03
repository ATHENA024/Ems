import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helper';
import './EmpDashboard.css';

const myTasks = [
  { title: 'Complete React module', due: '2026-05-25', priority: 'High', status: 'In Progress' },
  { title: 'Submit weekly report', due: '2026-05-26', priority: 'Medium', status: 'Pending' },
  { title: 'Team standup meeting', due: '2026-05-23', priority: 'Low', status: 'Completed' },
];

function EmpDashboard() {
  const { user } = useAuth();
  const [attendance] = useState(() => {
    const saved = localStorage.getItem('selfAttendance');
    return saved ? JSON.parse(saved) : [];
  });

  const today = new Date().toISOString().split('T')[0];
  const todayAtt = attendance.find((a) => a.date === today);
  const thisMonth = attendance.filter((a) => a.date.startsWith(today.substring(0, 7)));
  const presentDays = thisMonth.filter((a) => a.checkOut !== '-').length;

  const leaveReqs = JSON.parse(localStorage.getItem('selfLeaves') || '[]');
  const pendingLeaves = leaveReqs.filter((l) => l.status === 'Pending').length;

  const profile = {
    name: user?.name || 'Rahul Sharma',
    position: 'Senior Developer',
    dept: 'Engineering',
    salary: 1800000,
  };

  return (
    <div className="edash">
      <div className="page-header">
        <h1>My Dashboard</h1>
        <span style={{ color: '#64748b', fontSize: 14 }}>Welcome back, {profile.name}</span>
      </div>

      <div className="edash-grid-4">
        <div className="card edash-stat">
          <div className="edash-stat-icon" style={{ background: '#eef2ff', color: '#6366f1' }}>👤</div>
          <div>
            <div className="edash-stat-val">{profile.name}</div>
            <div className="edash-stat-lbl">{profile.position} • {profile.dept}</div>
          </div>
        </div>
        <div className="card edash-stat">
          <div className="edash-stat-icon" style={{ background: '#e6f4ea', color: '#0f9d58' }}>✅</div>
          <div>
            <div className="edash-stat-val">{presentDays}</div>
            <div className="edash-stat-lbl">Days Present (This Month)</div>
          </div>
        </div>
        <div className="card edash-stat">
          <div className="edash-stat-icon" style={{ background: '#fef7e0', color: '#f59e0b' }}>⏳</div>
          <div>
            <div className="edash-stat-val">{pendingLeaves}</div>
            <div className="edash-stat-lbl">Pending Leave{ pendingLeaves !== 1 ? 's' : ''}</div>
          </div>
        </div>
        <div className="card edash-stat">
          <div className="edash-stat-icon" style={{ background: '#fce8e6', color: '#dc2626' }}>💰</div>
          <div>
            <div className="edash-stat-val">{formatCurrency(profile.salary)}</div>
            <div className="edash-stat-lbl">Annual CTC</div>
          </div>
        </div>
      </div>

      <div className="edash-grid-2">
        <div className="card">
          <h3 className="edash-section-title">Today's Status</h3>
          <div className="edash-today">
            {todayAtt ? (
              <div className="edash-today-marked">
                <div className="edash-today-icon">✅</div>
                <div className="edash-today-text">
                  <strong>Checked In</strong> at {todayAtt.checkIn}
                  {todayAtt.checkOut !== '-' && <><br /><strong>Checked Out</strong> at {todayAtt.checkOut}</>}
                </div>
              </div>
            ) : (
              <div className="edash-today-unmarked">
                <div className="edash-today-icon">⏰</div>
                <div className="edash-today-text">
                  <strong>Not marked yet</strong><br />
                  <span style={{ fontSize: 13, color: '#64748b' }}>Go to Self Service to check in</span>
                </div>
              </div>
            )}
            <div className="edash-att-progress">
              <div className="edash-att-label">Monthly Attendance</div>
              <div className="edash-att-bar-bg">
                <div className="edash-att-bar" style={{ width: `${(presentDays / 22) * 100}%` }}></div>
              </div>
              <span className="edash-att-text">{presentDays}/22 days</span>
            </div>
            <a href="/self-service" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
              Go to Self Service
            </a>
          </div>
        </div>

        <div className="card">
          <h3 className="edash-section-title">My Tasks</h3>
          <div className="edash-task-list">
            {myTasks.map((t, i) => (
              <div key={i} className="edash-task-item">
                <span className={`edash-task-status ${t.status === 'Completed' ? 'done' : t.status === 'In Progress' ? 'progress' : ''}`}></span>
                <div className="edash-task-info">
                  <div className="edash-task-title">{t.title}</div>
                  <div className="edash-task-meta">Due: {t.due} • {t.priority}</div>
                </div>
                <span className={`badge badge-${t.status === 'Completed' ? 'success' : t.status === 'In Progress' ? 'warning' : 'danger'}`}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="edash-grid-2">
        <div className="card">
          <h3 className="edash-section-title">Quick Links</h3>
          <div className="edash-links">
            <a href="/self-service" className="edash-link"><span>🛠️</span> Self Service</a>
            <a href="/attendance" className="edash-link"><span>⏰</span> Attendance</a>
            <a href="/leave-management" className="edash-link"><span>🏖️</span> Apply Leave</a>
            <a href="/lms" className="edash-link"><span>🎓</span> Learning</a>
            <a href="/performance" className="edash-link"><span>🎯</span> My Tasks</a>
            <a href="/profile" className="edash-link"><span>👤</span> Profile</a>
          </div>
        </div>

        <div className="card">
          <h3 className="edash-section-title">Recent Announcements</h3>
          <div className="edash-ann-list">
            {[
              { title: 'Holiday Schedule for June', date: '2 days ago' },
              { title: 'New Insurance Policy Updates', date: '5 days ago' },
              { title: 'Q2 Townhall Meeting', date: '1 week ago' },
            ].map((a, i) => (
              <div key={i} className="edash-ann-item">
                <span className="edash-ann-dot"></span>
                <div>
                  <div className="edash-ann-title">{a.title}</div>
                  <div className="edash-ann-date">{a.date}</div>
                </div>
              </div>
            ))}
          </div>
          <a href="/announcements" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
            View All Announcements
          </a>
        </div>
      </div>
    </div>
  );
}

export default EmpDashboard;

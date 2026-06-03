import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Onboarding.css';

const templates = [
  { id: 1, title: 'Employee Welcome Kit', dept: 'All', tasks: ['Welcome email sent', 'ID card generated', 'Email account created', 'Desk assigned', 'Stationery provided'], icon: '🎒' },
  { id: 2, title: 'IT Setup', dept: 'Engineering', tasks: ['Laptop assigned', 'Software installed', 'VPN access granted', 'GitHub access', 'Slack added'], icon: '💻' },
  { id: 3, title: 'HR Induction', dept: 'All', tasks: ['Policy documents shared', 'Bank details collected', 'PF form submitted', 'Insurance enrolled', 'NDA signed'], icon: '📋' },
  { id: 4, title: 'Department Onboarding', dept: 'All', tasks: ['Team introduction', 'Project overview', 'Documentation access', 'Mentor assigned', 'First sprint assigned'], icon: '🤝' },
];

const newHires = [
  { id: 1, name: 'Ravi Kumar', position: 'Junior Developer', dept: 'Engineering', startDate: '2026-06-01', progress: 60, status: 'In Progress' },
  { id: 2, name: 'Meera Iyer', position: 'Marketing Associate', dept: 'Marketing', startDate: '2026-06-08', progress: 20, status: 'Pending' },
  { id: 3, name: 'Suresh Rao', position: 'Sales Executive', dept: 'Sales', startDate: '2026-06-15', progress: 0, status: 'Not Started' },
];

function Onboarding() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('hires');
  const [selectedHire, setSelectedHire] = useState(null);

  return (
    <div className="onb-page">
      <div className="page-header">
        <h1>Digital Onboarding</h1>
        {user?.role === 'admin' && <button className="btn btn-primary">+ New Hire</button>}
      </div>

      <div className="onb-summary">
        <div className="card onb-summary-card"><div className="onb-summary-val" style={{ color: '#6366f1' }}>{newHires.length}</div><div className="onb-summary-lbl">New Hires</div></div>
        <div className="card onb-summary-card"><div className="onb-summary-val" style={{ color: '#0f9d58' }}>{newHires.filter((h) => h.status === 'Completed').length}</div><div className="onb-summary-lbl">Completed</div></div>
        <div className="card onb-summary-card"><div className="onb-summary-val" style={{ color: '#f59e0b' }}>{newHires.filter((h) => h.status === 'In Progress').length}</div><div className="onb-summary-lbl">In Progress</div></div>
        <div className="card onb-summary-card"><div className="onb-summary-val" style={{ color: '#64748b' }}>{newHires.filter((h) => h.status === 'Not Started').length}</div><div className="onb-summary-lbl">Not Started</div></div>
      </div>

      <div className="onb-tabs">
        <button className={`onb-tab ${activeTab === 'hires' ? 'active' : ''}`} onClick={() => setActiveTab('hires')}>👤 New Hires</button>
        <button className={`onb-tab ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}>📋 Onboarding Templates</button>
      </div>

      {activeTab === 'hires' && (
        <div className="onb-hire-list">
          {newHires.map((hire) => (
            <div key={hire.id} className="card onb-hire-card" onClick={() => setSelectedHire(selectedHire?.id === hire.id ? null : hire)}>
              <div className="onb-hire-top">
                <div className="onb-hire-user">
                  <img src={`https://ui-avatars.com/api/?name=${hire.name.replace(' ', '+')}&background=6366f1&color=fff&size=40`} alt="" />
                  <div>
                    <div className="onb-hire-name">{hire.name}</div>
                    <div className="onb-hire-role">{hire.position} — {hire.dept}</div>
                  </div>
                </div>
                <span className={`badge badge-${hire.status === 'In Progress' ? 'warning' : hire.status === 'Not Started' ? 'danger' : 'success'}`}>{hire.status}</span>
              </div>
              <div className="onb-hire-meta">Start Date: {hire.startDate}</div>
              <div className="onb-progress">
                <div className="onb-progress-bar-bg">
                  <div className="onb-progress-bar" style={{ width: `${hire.progress}%`, background: hire.progress >= 80 ? '#0f9d58' : hire.progress >= 40 ? '#6366f1' : '#f59e0b' }}></div>
                </div>
                <span className="onb-progress-text">{hire.progress}%</span>
              </div>
              {selectedHire?.id === hire.id && (
                <div className="onb-hire-detail">
                  <h4 style={{ fontSize: 14, marginBottom: 10, color: '#0f1724' }}>Onboarding Tasks</h4>
                  {templates.filter((t) => t.dept === 'All' || t.dept === hire.dept).map((t) => (
                    <div key={t.id} className="onb-task-group">
                      <div className="onb-task-header">{t.icon} {t.title}</div>
                      {t.tasks.map((task, i) => (
                        <label key={i} className="onb-task-item">
                          <input type="checkbox" defaultChecked={i < Math.round(hire.progress / 100 * t.tasks.length)} />
                          <span>{task}</span>
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="onb-template-grid">
          {templates.map((t) => (
            <div key={t.id} className="card onb-template-card">
              <div className="onb-template-icon">{t.icon}</div>
              <h3 className="onb-template-title">{t.title}</h3>
              <span className="onb-template-dept">{t.dept}</span>
              <ul className="onb-template-tasks">
                {t.tasks.map((task, i) => <li key={i}>✓ {task}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Onboarding;

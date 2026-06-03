import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEmployeeContext } from '../context/EmployeeContext';
import { formatCurrency } from '../utils/helper';
import './AdminDashboard.css';

const deptColors = {
  Engineering: '#6366f1', Marketing: '#f59e0b', HR: '#0f9d58', Finance: '#dc2626', Sales: '#06b6d4',
};

function Dashboard() {
  const { logout } = useAuth();
  const { employees } = useEmployeeContext();
  const navigate = useNavigate();
  const totalEmp = employees.length;
  const activeEmp = employees.filter((e) => e.status === 'Active').length;
  const totalSalary = employees.reduce((s, e) => s + e.salary, 0);

  const deptData = {};
  employees.forEach((e) => {
    if (!deptData[e.department]) deptData[e.department] = { count: 0, salary: 0 };
    deptData[e.department].count += 1;
    deptData[e.department].salary += e.salary;
  });

  return (
    <div className="adash">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#64748b', fontSize: 14 }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <button className="btn btn-danger" style={{ padding: '6px 16px', fontSize: 13 }} onClick={() => { logout(); navigate('/login', { replace: true }); }}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="adash-grid-4">
        <div className="card adash-stat">
          <div className="adash-stat-icon" style={{ background: '#eef2ff', color: '#6366f1' }}>👥</div>
          <div><div className="adash-stat-val">{totalEmp}</div><div className="adash-stat-lbl">Total Employees</div></div>
        </div>
        <div className="card adash-stat">
          <div className="adash-stat-icon" style={{ background: '#e6f4ea', color: '#0f9d58' }}>✅</div>
          <div><div className="adash-stat-val">{activeEmp}</div><div className="adash-stat-lbl">Active</div></div>
        </div>
        <div className="card adash-stat">
          <div className="adash-stat-icon" style={{ background: '#fce8e6', color: '#dc2626' }}>❌</div>
          <div><div className="adash-stat-val">{totalEmp - activeEmp}</div><div className="adash-stat-lbl">Inactive</div></div>
        </div>
        <div className="card adash-stat">
          <div className="adash-stat-icon" style={{ background: '#fef7e0', color: '#f59e0b' }}>💰</div>
          <div><div className="adash-stat-val">{formatCurrency(totalSalary)}</div><div className="adash-stat-lbl">Total Salary</div></div>
        </div>
      </div>

      <div className="adash-grid-2">
        <div className="card">
          <h3 className="adash-section-title">Department Overview</h3>
          {Object.entries(deptData).map(([dept, data]) => (
            <div key={dept} className="adash-dept-row">
              <div className="adash-dept-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: deptColors[dept] }}></span>
                  <span className="adash-dept-name">{dept}</span>
                </span>
                <span className="adash-dept-count">{data.count} emp • {formatCurrency(data.salary)}</span>
              </div>
              <div className="adash-dept-bar-bg">
                <div className="adash-dept-bar" style={{ width: `${(data.count / totalEmp) * 100}%`, background: deptColors[dept] }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="adash-section-title">Pending Actions</h3>
          <div className="adash-pending-list">
            {[
              { action: 'Leave requests to approve', count: 3, icon: '🏖️', color: '#f59e0b' },
              { action: 'Helpdesk tickets open', count: 5, icon: '🎫', color: '#dc2626' },
              { action: 'Pending appraisals', count: 4, icon: '⭐', color: '#6366f1' },
              { action: 'New hires to onboard', count: 2, icon: '🚀', color: '#0f9d58' },
            ].map((item, i) => (
              <div key={i} className="adash-pending-item">
                <div className="adash-pending-icon" style={{ background: `${item.color}15`, color: item.color }}>{item.icon}</div>
                <span className="adash-pending-action">{item.action}</span>
                <span className="adash-pending-count" style={{ background: item.color, color: '#fff' }}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="adash-grid-2">
        <div className="card">
          <h3 className="adash-section-title">Recent Activity</h3>
          <div className="adash-activity-list">
            {[
              { text: 'Sneha Patel approved leave for Arjun Nair', time: '10 min ago', type: 'approved' },
              { text: 'Rahul Sharma completed performance task', time: '1 hr ago', type: 'completed' },
              { text: 'Divya Joshi submitted helpdesk ticket', time: '2 hr ago', type: 'ticket' },
              { text: 'Payroll for June processed', time: '3 hr ago', type: 'payroll' },
              { text: 'New employee Ravi Kumar onboarded', time: '1 day ago', type: 'onboarded' },
            ].map((a, i) => (
              <div key={i} className="adash-activity-item">
                <span className={`adash-activity-dot ${a.type}`}></span>
                <div className="adash-activity-text">{a.text}</div>
                <span className="adash-activity-time">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="adash-section-title">Quick Actions</h3>
          <div className="adash-actions-grid">
            <button className="adash-action-btn" onClick={() => window.location.href = '/employees'}>
              <span className="adash-action-icon" style={{ background: '#eef2ff', color: '#6366f1' }}>👥</span>
              <span>Manage Employees</span>
            </button>
            <button className="adash-action-btn" onClick={() => window.location.href = '/payroll'}>
              <span className="adash-action-icon" style={{ background: '#e6f4ea', color: '#0f9d58' }}>💰</span>
              <span>Run Payroll</span>
            </button>
            <button className="adash-action-btn" onClick={() => window.location.href = '/announcements'}>
              <span className="adash-action-icon" style={{ background: '#fef7e0', color: '#f59e0b' }}>📢</span>
              <span>Post Announcement</span>
            </button>
            <button className="adash-action-btn" onClick={() => window.location.href = '/reports'}>
              <span className="adash-action-icon" style={{ background: '#fce8e6', color: '#dc2626' }}>📈</span>
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

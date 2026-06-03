import React, { useState } from 'react';
import './Security.css';

const users = [
  { id: 1, name: 'Admin User', email: 'admin@ems.com', role: 'Super Admin', dept: 'IT', status: 'Active', lastLogin: '2026-05-22 09:15', mfa: true },
  { id: 2, name: 'Sneha Patel', email: 'sneha@ems.com', role: 'HR Manager', dept: 'HR', status: 'Active', lastLogin: '2026-05-22 08:30', mfa: true },
  { id: 3, name: 'Rahul Sharma', email: 'rahul@ems.com', role: 'Employee', dept: 'Engineering', status: 'Active', lastLogin: '2026-05-22 09:00', mfa: false },
  { id: 4, name: 'Priya Verma', email: 'priya@ems.com', role: 'Department Head', dept: 'Marketing', status: 'Active', lastLogin: '2026-05-21 18:45', mfa: true },
  { id: 5, name: 'Amit Singh', email: 'amit@ems.com', role: 'Employee', dept: 'Engineering', status: 'Active', lastLogin: '2026-05-22 09:10', mfa: false },
  { id: 6, name: 'Vikram Reddy', email: 'vikram@ems.com', role: 'Employee', dept: 'Finance', status: 'Inactive', lastLogin: '2026-05-15 12:00', mfa: false },
  { id: 7, name: 'Arjun Nair', email: 'arjun@ems.com', role: 'Employee', dept: 'Engineering', status: 'Active', lastLogin: '2026-05-21 22:15', mfa: false },
  { id: 8, name: 'Divya Joshi', email: 'divya@ems.com', role: 'Department Head', dept: 'Sales', status: 'Active', lastLogin: '2026-05-22 07:50', mfa: true },
];

const roles = [
  { name: 'Super Admin', users: 1, permissions: ['Full Access', 'User Management', 'Security Settings', 'All Modules', 'Delete Data'] },
  { name: 'Department Head', users: 2, permissions: ['Department View', 'Approve Leaves', 'Performance Reviews', 'Reports', 'Team Management'] },
  { name: 'HR Manager', users: 1, permissions: ['Employee Management', 'Payroll View', 'Leave Management', 'Onboarding', 'Reports'] },
  { name: 'Employee', users: 4, permissions: ['Self Service', 'My Attendance', 'Apply Leave', 'My Payslip', 'Courses'] },
];

const modules = ['Dashboard', 'Employees', 'Attendance', 'Payroll', 'Leave', 'Performance', 'Appraisals', 'Onboarding', 'LMS', 'Announcements', 'Helpdesk', 'Reports', 'Profile', 'Security'];

function Security() {
  const [activeSection, setActiveSection] = useState('users');
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="sec-page">
      <div className="page-header">
        <h1>Security & Access Control</h1>
        <span style={{ color: '#64748b', fontSize: 14 }}>Role-Based Access Management</span>
      </div>

      <div className="sec-summary">
        <div className="card sec-summary-card"><div className="sec-summary-val" style={{ color: '#6366f1' }}>{users.length}</div><div className="sec-summary-lbl">Users</div></div>
        <div className="card sec-summary-card"><div className="sec-summary-val" style={{ color: '#0f9d58' }}>{users.filter((u) => u.status === 'Active').length}</div><div className="sec-summary-lbl">Active</div></div>
        <div className="card sec-summary-card"><div className="sec-summary-val" style={{ color: '#dc2626' }}>{users.filter((u) => u.status === 'Inactive').length}</div><div className="sec-summary-lbl">Inactive</div></div>
        <div className="card sec-summary-card"><div className="sec-summary-val" style={{ color: '#0f9d58' }}>{users.filter((u) => u.mfa).length}</div><div className="sec-summary-lbl">MFA Enabled</div></div>
      </div>

      <div className="sec-tabs">
        <button className={`sec-tab ${activeSection === 'users' ? 'active' : ''}`} onClick={() => setActiveSection('users')}>👤 Users</button>
        <button className={`sec-tab ${activeSection === 'roles' ? 'active' : ''}`} onClick={() => setActiveSection('roles')}>🔑 Roles & Permissions</button>
        <button className={`sec-tab ${activeSection === 'audit' ? 'active' : ''}`} onClick={() => setActiveSection('audit')}>📋 Audit Log</button>
      </div>

      {activeSection === 'users' && (
        <div className="card" style={{ padding: 20 }}>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>User</th><th>Email</th><th>Role</th><th>Department</th><th>MFA</th><th>Status</th><th>Last Login</th><th>Action</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={`https://ui-avatars.com/api/?name=${u.name.replace(' ', '+')}&background=6366f1&color=fff&size=28`} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                      <span style={{ fontWeight: 500 }}>{u.name}</span>
                    </div></td>
                    <td>{u.email}</td>
                    <td><span className="sec-role-badge">{u.role}</span></td>
                    <td>{u.dept}</td>
                    <td>{u.mfa ? <span className="badge badge-success">On</span> : <span className="badge badge-danger">Off</span>}</td>
                    <td><span className={`badge badge-${u.status === 'Active' ? 'success' : 'danger'}`}>{u.status}</span></td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>{u.lastLogin}</td>
                    <td><button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: 11 }} onClick={() => setSelectedUser(selectedUser?.id === u.id ? null : u)}>Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedUser && (
            <div className="sec-user-edit" style={{ marginTop: 20, padding: 20, background: '#f8fafc', borderRadius: 10 }}>
              <h4 style={{ marginBottom: 16 }}>Edit: {selectedUser.name}</h4>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: 1, minWidth: 200 }}>
                  <label>Role</label>
                  <select defaultValue={selectedUser.role}>
                    {roles.map((r) => <option key={r.name}>{r.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: 200 }}>
                  <label>Status</label>
                  <select defaultValue={selectedUser.status}>
                    <option>Active</option><option>Inactive</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: 200 }}>
                  <label>MFA</label>
                  <select defaultValue={selectedUser.mfa ? 'On' : 'Off'}>
                    <option>On</option><option>Off</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary" style={{ marginTop: 12 }}>Save Changes</button>
            </div>
          )}
        </div>
      )}

      {activeSection === 'roles' && (
        <div className="sec-roles-grid">
          {roles.map((role) => (
            <div key={role.name} className="card sec-role-card">
              <h3 className="sec-role-name">{role.name}</h3>
              <span className="sec-role-count">{role.users} user{role.users > 1 ? 's' : ''}</span>
              <div className="sec-perm-list">
                <div className="sec-perm-header">Permissions</div>
                {role.permissions.map((p, i) => (
                  <div key={i} className="sec-perm-item">
                    <span className="sec-perm-check">✓</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'audit' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 className="sec-section-title" style={{ marginBottom: 16 }}>Recent Activity Log</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Module</th><th>IP Address</th></tr></thead>
              <tbody>
                {[
                  { time: '2026-05-22 09:15', user: 'Admin User', action: 'Login', module: 'Auth', ip: '192.168.1.100' },
                  { time: '2026-05-22 09:10', user: 'Amit Singh', action: 'Login', module: 'Auth', ip: '192.168.1.105' },
                  { time: '2026-05-22 09:00', user: 'Rahul Sharma', action: 'Login', module: 'Auth', ip: '192.168.1.102' },
                  { time: '2026-05-22 08:30', user: 'Sneha Patel', action: 'Login', module: 'Auth', ip: '192.168.1.108' },
                  { time: '2026-05-21 22:15', user: 'Arjun Nair', action: 'Marked Attendance', module: 'Attendance', ip: '192.168.1.110' },
                  { time: '2026-05-21 18:45', user: 'Priya Verma', action: 'Approved Leave', module: 'Leave', ip: '192.168.1.103' },
                  { time: '2026-05-21 16:30', user: 'Admin User', action: 'Updated Payroll', module: 'Payroll', ip: '192.168.1.100' },
                  { time: '2026-05-21 14:00', user: 'Divya Joshi', action: 'Submitted Review', module: 'Appraisals', ip: '192.168.1.107' },
                ].map((log, i) => (
                  <tr key={i}>
                    <td style={{ fontSize: 12 }}>{log.time}</td>
                    <td>{log.user}</td>
                    <td>{log.action}</td>
                    <td><span className="sec-role-badge">{log.module}</span></td>
                    <td style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Security;

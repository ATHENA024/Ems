import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmployeeContext } from '../context/EmployeeContext';
import { formatCurrency, calcSalaryBreakdown } from '../utils/helper';
import './SelfService.css';

function SelfService() {
  const { user } = useAuth();
  const { employees } = useEmployeeContext();

  const [activeSection, setActiveSection] = useState('profile');
  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('selfAttendance');
    return saved ? JSON.parse(saved) : [];
  });

  const [leaveReqs, setLeaveReqs] = useState(() => {
    const saved = localStorage.getItem('selfLeaves');
    return saved ? JSON.parse(saved) : [];
  });

  const [leaveForm, setLeaveForm] = useState({ type: 'Sick Leave', from: '', to: '', reason: '' });

  const today = new Date().toISOString().split('T')[0];
  const todayAtt = attendance.find((a) => a.date === today);

  const handleCheckIn = () => {
    if (todayAtt) return alert('Already checked in today');
    const record = {
      id: Date.now(),
      date: today,
      checkIn: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      checkOut: '-',
    };
    const updated = [...attendance, record];
    setAttendance(updated);
    localStorage.setItem('selfAttendance', JSON.stringify(updated));
  };

  const handleCheckOut = () => {
    const updated = attendance.map((a) =>
      a.date === today ? { ...a, checkOut: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) } : a
    );
    setAttendance(updated);
    localStorage.setItem('selfAttendance', JSON.stringify(updated));
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveForm.from || !leaveForm.to || !leaveForm.reason) return;
    const req = { ...leaveForm, id: Date.now(), status: 'Pending', submitted: new Date().toLocaleDateString('en-IN') };
    const updated = [...leaveReqs, req];
    setLeaveReqs(updated);
    localStorage.setItem('selfLeaves', JSON.stringify(updated));
    setLeaveForm({ type: 'Sick Leave', from: '', to: '', reason: '' });
  };

  const emp = employees.find((e) => `${e.firstName} ${e.lastName}` === user?.name);
  const myProfile = emp || employees[0];
  const salaryBD = calcSalaryBreakdown(myProfile.salary);

  return (
    <div className="ss-page">
      <div className="page-header">
        <h1>Employee Self Service</h1>
        <span style={{ color: '#64748b', fontSize: 14 }}>Welcome, {user?.name || 'Employee'}</span>
      </div>

      <div className="ss-tabs">
        <button className={`ss-tab ${activeSection === 'profile' ? 'active' : ''}`} onClick={() => setActiveSection('profile')}>👤 My Profile</button>
        <button className={`ss-tab ${activeSection === 'attendance' ? 'active' : ''}`} onClick={() => setActiveSection('attendance')}>⏰ My Attendance</button>
        <button className={`ss-tab ${activeSection === 'leave' ? 'active' : ''}`} onClick={() => setActiveSection('leave')}>🏖️ Apply Leave</button>
        <button className={`ss-tab ${activeSection === 'payroll' ? 'active' : ''}`} onClick={() => setActiveSection('payroll')}>💰 Payslips</button>
      </div>

      {activeSection === 'profile' && (
        <div className="card ss-card">
          <div className="ss-profile-header">
            <img src={myProfile.avatar || `https://ui-avatars.com/api/?name=${myProfile.firstName}+${myProfile.lastName}&background=6366f1&color=fff&size=80`} alt="Profile" />
            <div>
              <h2>{myProfile.firstName} {myProfile.lastName}</h2>
              <p className="ss-role">{myProfile.position} — {myProfile.department}</p>
              <span className={`badge badge-${myProfile.status === 'Active' ? 'success' : 'danger'}`}>{myProfile.status}</span>
            </div>
          </div>
          <div className="ss-profile-grid">
            <div className="ss-profile-item"><span className="ss-label">Email</span><span>{myProfile.email}</span></div>
            <div className="ss-profile-item"><span className="ss-label">Phone</span><span>{myProfile.phone}</span></div>
            <div className="ss-profile-item"><span className="ss-label">Department</span><span>{myProfile.department}</span></div>
            <div className="ss-profile-item"><span className="ss-label">Position</span><span>{myProfile.position}</span></div>
            <div className="ss-profile-item"><span className="ss-label">Joined</span><span>{myProfile.joinDate}</span></div>
            <div className="ss-profile-item"><span className="ss-label">Salary</span><span className="ss-salary">{formatCurrency(salaryBD.annual)}/yr</span></div>
          </div>
        </div>
      )}

      {activeSection === 'attendance' && (
        <div className="card ss-card">
          <div className="ss-att-actions">
            <div className="ss-att-status">
              {todayAtt ? (
                <>
                  <div className="ss-att-time">Check-In: <strong>{todayAtt.checkIn}</strong></div>
                  <div className="ss-att-time">Check-Out: <strong>{todayAtt.checkOut}</strong></div>
                </>
              ) : (
                <div className="ss-att-time" style={{ color: '#64748b' }}>Not marked today</div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {!todayAtt && <button className="btn btn-success" onClick={handleCheckIn}>✅ Check In</button>}
              {todayAtt && todayAtt.checkOut === '-' && <button className="btn btn-primary" onClick={handleCheckOut}>🚪 Check Out</button>}
            </div>
          </div>
          <h3 className="ss-section-title">Attendance History</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Date</th><th>Check-In</th><th>Check-Out</th><th>Status</th></tr>
              </thead>
              <tbody>
                {attendance.length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>No attendance records</td></tr>
                )}
                {[...attendance].reverse().map((a) => (
                  <tr key={a.id}>
                    <td>{a.date}</td>
                    <td>{a.checkIn}</td>
                    <td>{a.checkOut}</td>
                    <td><span className={`badge badge-${a.checkOut !== '-' ? 'success' : 'warning'}`}>{a.checkOut !== '-' ? 'Completed' : 'Active'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSection === 'leave' && (
        <div className="ss-grid-2col">
          <div className="card ss-card">
            <h3 className="ss-section-title">Apply for Leave</h3>
            <form onSubmit={handleLeaveSubmit}>
              <div className="form-group">
                <label>Leave Type</label>
                <select value={leaveForm.type} onChange={(e) => setLeaveForm((p) => ({ ...p, type: e.target.value }))}>
                  <option>Sick Leave</option>
                  <option>Casual Leave</option>
                  <option>Annual Leave</option>
                  <option>Personal Leave</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>From Date</label>
                  <input type="date" value={leaveForm.from} onChange={(e) => setLeaveForm((p) => ({ ...p, from: e.target.value }))} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>To Date</label>
                  <input type="date" value={leaveForm.to} onChange={(e) => setLeaveForm((p) => ({ ...p, to: e.target.value }))} required />
                </div>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea rows="3" value={leaveForm.reason} onChange={(e) => setLeaveForm((p) => ({ ...p, reason: e.target.value }))} placeholder="Enter reason for leave" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Submit Request</button>
            </form>
          </div>
          <div className="card ss-card">
            <h3 className="ss-section-title">My Leave Requests</h3>
            {leaveReqs.length === 0 ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: 20 }}>No leave requests</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[...leaveReqs].reverse().map((r) => (
                  <div key={r.id} className="ss-leave-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{r.type}</strong>
                      <span className={`badge badge-${r.status === 'Approved' ? 'success' : r.status === 'Rejected' ? 'danger' : 'warning'}`}>{r.status}</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{r.from} → {r.to}</div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>{r.reason}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'payroll' && (
        <div className="card ss-card">
          <h3 className="ss-section-title">Payslip — June 2026</h3>
          <div className="ss-payslip">
            <div className="ss-payslip-header">
              <div>
                <h2 style={{ color: '#6366f1' }}>EMS Pvt. Ltd.</h2>
                <p style={{ color: '#64748b', fontSize: 13 }}>Employee Management Systems</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#0f9d58' }}>{formatCurrency(salaryBD.monthlyNet)}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Net Pay for June 2026</div>
              </div>
            </div>
            <div className="ss-payslip-details">
              <div className="ss-payslip-row"><span>Employee</span><span>{myProfile.firstName} {myProfile.lastName}</span></div>
              <div className="ss-payslip-row"><span>Employee ID</span><span>EMP-001</span></div>
              <div className="ss-payslip-row"><span>PAN</span><span>ABCDE1234F</span></div>
              <div className="ss-payslip-row"><span>Department</span><span>Engineering</span></div>
              <div className="ss-payslip-row"><span>Designation</span><span>Senior Developer</span></div>
              <div className="ss-payslip-row"><span>Pay Period</span><span>June 2026</span></div>
              <div className="ss-payslip-row"><span>Bank Account</span><span>XXXX-XXXX-4821</span></div>
            </div>
            <div className="ss-payslip-breakdown">
              <div className="ss-payslip-row earn"><span>Basic Salary</span><span>{formatCurrency(salaryBD.basic / 12)}</span></div>
              <div className="ss-payslip-row earn"><span>HRA</span><span>{formatCurrency(salaryBD.hra / 12)}</span></div>
              <div className="ss-payslip-row earn"><span>Dearness Allowance</span><span>{formatCurrency(salaryBD.da / 12)}</span></div>
              <div className="ss-payslip-row earn"><span>Other Allowances</span><span>{formatCurrency(salaryBD.otherAllowances / 12)}</span></div>
              <div className="ss-payslip-row deduct"><span>PF Deduction</span><span>-{formatCurrency(salaryBD.pf)}</span></div>
              <div className="ss-payslip-row deduct"><span>TDS (Income Tax)</span><span>-{formatCurrency(salaryBD.monthlyTds)}</span></div>
              <div className="ss-payslip-row total"><span>Net Payable</span><span className="ss-salary">{formatCurrency(salaryBD.monthlyNet)}</span></div>
            </div>
            <div style={{ marginTop: 16, padding: '12px 16px', background: '#fef7e0', borderRadius: 8, fontSize: 12, color: '#92400e' }}>
              <strong>TDS Summary:</strong> Annual Taxable Income: {formatCurrency(salaryBD.taxableIncome)} | 
              Total Annual TDS: {formatCurrency(salaryBD.tds)} | 
              TDS Rate: {(salaryBD.tds / salaryBD.taxableIncome * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SelfService;

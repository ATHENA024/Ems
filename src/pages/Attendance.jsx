import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmployeeContext } from '../context/EmployeeContext';
import './Attendance.css';

const today = new Date().toISOString().split('T')[0];

function Attendance() {
  const { user } = useAuth();
  const { employees } = useEmployeeContext();
  const isAdmin = user?.role === 'admin';

  const emp = employees.find(
    (e) => `${e.firstName} ${e.lastName}` === user?.name
  );

  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('attendance');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedEmp, setSelectedEmp] = useState('');
  const [activeTab, setActiveTab] = useState('today');

  const employeeRecords = isAdmin
    ? records
    : records.filter((r) => r.empId === emp?.id);
  const todayRecords = employeeRecords.filter((r) => r.date === today);

  const availableEmployees = isAdmin
    ? employees
    : emp ? [emp] : [];

  const handleMarkIn = () => {
    const empId = isAdmin ? parseInt(selectedEmp) : emp?.id;
    if (!empId) return;
    const existing = todayRecords.find((r) => r.empId === empId);
    if (existing) return alert('Already marked today');
    const target = isAdmin
      ? employees.find((e) => e.id === empId)
      : emp;
    const newRecord = {
      id: Date.now(),
      empId,
      name: `${target.firstName} ${target.lastName}`,
      date: today,
      checkIn: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      checkOut: '-',
      status: 'Present',
    };
    const updated = [...records, newRecord];
    setRecords(updated);
    localStorage.setItem('attendance', JSON.stringify(updated));
  };

  const handleMarkOut = (id) => {
    const updated = records.map((r) =>
      r.id === id
        ? { ...r, checkOut: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), status: 'Present' }
        : r
    );
    setRecords(updated);
    localStorage.setItem('attendance', JSON.stringify(updated));
  };

  const displayRecords = activeTab === 'today' ? todayRecords : employeeRecords;
  const present = todayRecords.filter((r) => r.checkOut !== '-' || r.checkIn !== '-').length;
  const checkedIn = todayRecords.filter((r) => r.checkIn !== '-' && r.checkOut === '-').length;

  const todayStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      <div className="page-header">
        <h1>Attendance Tracker</h1>
        <span style={{ color: '#64748b', fontSize: 14 }}>{todayStr}</span>
      </div>

      <div className="att-summary">
        <div className="card att-summary-card">
          <div className="att-summary-value" style={{ color: '#6366f1' }}>{isAdmin ? employees.length : 1}</div>
          <div className="att-summary-label">{isAdmin ? 'Total Employees' : 'My Attendance'}</div>
        </div>
        <div className="card att-summary-card">
          <div className="att-summary-value" style={{ color: '#0f9d58' }}>{present}</div>
          <div className="att-summary-label">Present Today</div>
        </div>
        <div className="card att-summary-card">
          <div className="att-summary-value" style={{ color: '#f4b400' }}>{(isAdmin ? employees.length : 1) - present}</div>
          <div className="att-summary-label">Absent Today</div>
        </div>
        <div className="card att-summary-card">
          <div className="att-summary-value" style={{ color: '#d93025' }}>{checkedIn}</div>
          <div className="att-summary-label">Checked In (no checkout)</div>
        </div>
      </div>

      <div className="card att-mark-card">
        <h3 className="att-mark-title">Mark Attendance</h3>
        <div className="att-mark-row">
          {isAdmin ? (
            <select value={selectedEmp} onChange={(e) => setSelectedEmp(e.target.value)}>
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} — {emp.department}</option>
              ))}
            </select>
          ) : (
            <div style={{ flex: 1, padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc', fontWeight: 500 }}>
              {emp ? `${emp.firstName} ${emp.lastName} — ${emp.department}` : 'Employee'}
            </div>
          )}
          <button className="btn btn-success" onClick={handleMarkIn}>✅ Mark Check-In</button>
        </div>
      </div>

      <div className="card">
        <div className="att-tabs">
          <button className={`att-tab ${activeTab === 'today' ? 'active' : ''}`} onClick={() => setActiveTab('today')}>Today</button>
          <button className={`att-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Records</button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayRecords.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>
                    {activeTab === 'today' ? 'No attendance marked for today' : 'No records found'}
                  </td>
                </tr>
              )}
              {displayRecords.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.name}</strong></td>
                  <td>{r.date}</td>
                  <td>{r.checkIn}</td>
                  <td>{r.checkOut}</td>
                  <td>
                    <span className={`badge badge-${r.status === 'Present' ? 'success' : r.status === 'Absent' ? 'danger' : 'warning'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    {r.checkOut === '-' && (
                      <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => handleMarkOut(r.id)}>
                        Mark Out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Attendance;

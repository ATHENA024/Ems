import React, { useState } from 'react';
import { formatCurrency, calcSalaryBreakdown } from '../utils/helper';
import './Reports.css';

const employees = [
  { id: 1, firstName: 'Rahul', lastName: 'Sharma', department: 'Engineering', position: 'Senior Developer', salary: 1800000, status: 'Active', shift: 'Morning' },
  { id: 2, firstName: 'Priya', lastName: 'Verma', department: 'Marketing', position: 'Marketing Lead', salary: 1400000, status: 'Active', shift: 'Morning' },
  { id: 3, firstName: 'Amit', lastName: 'Singh', department: 'Engineering', position: 'Full Stack Developer', salary: 1200000, status: 'Active', shift: 'Evening' },
  { id: 4, firstName: 'Sneha', lastName: 'Patel', department: 'HR', position: 'HR Manager', salary: 1100000, status: 'Active', shift: 'Morning' },
  { id: 5, firstName: 'Vikram', lastName: 'Reddy', department: 'Finance', position: 'Accountant', salary: 950000, status: 'Active', shift: 'Morning' },
  { id: 6, firstName: 'Ananya', lastName: 'Gupta', department: 'Marketing', position: 'Content Strategist', salary: 850000, status: 'Active', shift: 'Evening' },
  { id: 7, firstName: 'Arjun', lastName: 'Nair', department: 'Engineering', position: 'DevOps Engineer', salary: 1600000, status: 'Active', shift: 'Night' },
  { id: 8, firstName: 'Divya', lastName: 'Joshi', department: 'Sales', position: 'Sales Manager', salary: 1300000, status: 'Active', shift: 'Morning' },
  { id: 9, firstName: 'Karan', lastName: 'Mehta', department: 'Engineering', position: 'Frontend Developer', salary: 1000000, status: 'Active', shift: 'Morning' },
  { id: 10, firstName: 'Isha', lastName: 'Kapoor', department: 'HR', position: 'Recruiter', salary: 700000, status: 'Inactive', shift: 'Morning' },
  { id: 11, firstName: 'Rohit', lastName: 'Desai', department: 'Finance', position: 'Financial Analyst', salary: 1050000, status: 'Active', shift: 'Evening' },
  { id: 12, firstName: 'Neha', lastName: 'Agarwal', department: 'Sales', position: 'Sales Executive', salary: 800000, status: 'Active', shift: 'Night' },
];

const reportTypes = [
  { id: 'employee', label: 'Employee Report', icon: '👥', desc: 'Department, shift & salary distribution' },
  { id: 'attendance', label: 'Attendance Report', icon: '⏰', desc: 'Check-in/out records & present days' },
  { id: 'payroll', label: 'Payroll Report', icon: '💰', desc: 'Salary breakdown, TDS & payments' },
  { id: 'leave', label: 'Leave Report', icon: '🏖️', desc: 'Leave usage, balances & approvals' },
];

function Reports() {
  const [active, setActive] = useState('employee');

  const attendanceData = JSON.parse(localStorage.getItem('attendance') || '[]');
  const payments = JSON.parse(localStorage.getItem('payrollPayments') || '[]');
  const leaves = JSON.parse(localStorage.getItem('leaveRequests') || '[]');

  const r = {
    employee: () => {
      const depts = {};
      employees.forEach((e) => {
        if (!depts[e.department]) depts[e.department] = { count: 0, salary: 0 };
        depts[e.department].count += 1;
        depts[e.department].salary += e.salary;
      });
      return (
        <div className="rep-section">
          <div className="rep-stat-grid">
            <div className="card rep-stat"><div className="rep-stat-val">{employees.length}</div><div className="rep-stat-lbl">Total</div></div>
            <div className="card rep-stat"><div className="rep-stat-val" style={{ color: '#0f9d58' }}>{employees.filter((e) => e.status === 'Active').length}</div><div className="rep-stat-lbl">Active</div></div>
            <div className="card rep-stat"><div className="rep-stat-val" style={{ color: '#f59e0b' }}>{employees.filter((e) => e.shift === 'Morning').length}</div><div className="rep-stat-lbl">Morning Shift</div></div>
            <div className="card rep-stat"><div className="rep-stat-val" style={{ color: '#6366f1' }}>{employees.filter((e) => e.shift === 'Evening').length}</div><div className="rep-stat-lbl">Evening Shift</div></div>
            <div className="card rep-stat"><div className="rep-stat-val" style={{ color: '#1e293b' }}>{employees.filter((e) => e.shift === 'Night').length}</div><div className="rep-stat-lbl">Night Shift</div></div>
            <div className="card rep-stat"><div className="rep-stat-val" style={{ color: '#dc2626' }}>{formatCurrency(employees.reduce((s, e) => s + e.salary, 0))}</div><div className="rep-stat-lbl">Salary Budget</div></div>
          </div>
          <table className="rep-table">
            <thead><tr><th>Department</th><th>Employees</th><th>Total Salary</th><th>Avg Salary</th></tr></thead>
            <tbody>
              {Object.entries(depts).map(([dept, d]) => (
                <tr key={dept}><td><strong>{dept}</strong></td><td>{d.count}</td><td>{formatCurrency(d.salary)}</td><td>{formatCurrency(Math.round(d.salary / d.count))}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
    attendance: () => {
      const present = attendanceData.filter((a) => a.checkOut !== '-').length;
      const total = attendanceData.length;
      return (
        <div className="rep-section">
          <div className="rep-stat-grid">
            <div className="card rep-stat"><div className="rep-stat-val">{total}</div><div className="rep-stat-lbl">Total Records</div></div>
            <div className="card rep-stat"><div className="rep-stat-val" style={{ color: '#0f9d58' }}>{present}</div><div className="rep-stat-lbl">Present</div></div>
            <div className="card rep-stat"><div className="rep-stat-val" style={{ color: '#dc2626' }}>{total - present}</div><div className="rep-stat-lbl">Absent</div></div>
          </div>
          {total === 0 ? <p style={{ color: '#94a3b8', marginTop: 16 }}>No attendance records found.</p> : (
            <table className="rep-table">
              <thead><tr><th>Employee</th><th>Date</th><th>Check In</th><th>Check Out</th><th>Status</th></tr></thead>
              <tbody>
                {[...attendanceData].reverse().slice(0, 50).map((a, i) => (
                  <tr key={i}><td>{a.empName}</td><td>{a.date}</td><td>{a.checkIn}</td><td>{a.checkOut}</td><td><span className={`badge badge-${a.checkOut !== '-' ? 'success' : 'danger'}`}>{a.checkOut !== '-' ? 'Present' : 'Absent'}</span></td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
    },
    payroll: () => {
      const totalSalary = employees.reduce((s, e) => s + e.salary, 0);
      const totalPaid = payments.reduce((s, p) => s + p.monthlyNet, 0);
      const totalTds = employees.reduce((s, e) => s + calcSalaryBreakdown(e.salary).tds, 0);
      return (
        <div className="rep-section">
          <div className="rep-stat-grid">
            <div className="card rep-stat"><div className="rep-stat-val">{formatCurrency(totalSalary)}</div><div className="rep-stat-lbl">Annual Budget</div></div>
            <div className="card rep-stat"><div className="rep-stat-val" style={{ color: '#0f9d58' }}>{formatCurrency(totalPaid)}</div><div className="rep-stat-lbl">Paid This Month</div></div>
            <div className="card rep-stat"><div className="rep-stat-val" style={{ color: '#dc2626' }}>{formatCurrency(totalTds)}</div><div className="rep-stat-lbl">Annual TDS</div></div>
            <div className="card rep-stat"><div className="rep-stat-val">{payments.length}/{employees.length}</div><div className="rep-stat-lbl">Employees Paid</div></div>
          </div>
          <table className="rep-table">
            <thead><tr><th>Employee</th><th>Annual CTC</th><th>Monthly Net</th><th>Monthly TDS</th><th>Status</th></tr></thead>
            <tbody>
              {employees.map((emp) => {
                const bd = calcSalaryBreakdown(emp.salary);
                const paid = payments.find((p) => p.empId === emp.id);
                return (
                  <tr key={emp.id}><td><strong>{emp.firstName} {emp.lastName}</strong></td><td>{formatCurrency(emp.salary)}</td><td>{formatCurrency(bd.monthlyNet)}</td><td style={{ color: '#dc2626' }}>{formatCurrency(bd.monthlyTds)}</td><td><span className={`badge badge-${paid ? 'success' : 'warning'}`}>{paid ? 'Paid' : 'Pending'}</span></td></tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    },
    leave: () => {
      const pending = leaves.filter((l) => l.status === 'Pending').length;
      const approved = leaves.filter((l) => l.status === 'Approved').length;
      const rejected = leaves.filter((l) => l.status === 'Rejected').length;
      return (
        <div className="rep-section">
          <div className="rep-stat-grid">
            <div className="card rep-stat"><div className="rep-stat-val">{leaves.length}</div><div className="rep-stat-lbl">Total Requests</div></div>
            <div className="card rep-stat"><div className="rep-stat-val" style={{ color: '#f59e0b' }}>{pending}</div><div className="rep-stat-lbl">Pending</div></div>
            <div className="card rep-stat"><div className="rep-stat-val" style={{ color: '#0f9d58' }}>{approved}</div><div className="rep-stat-lbl">Approved</div></div>
            <div className="card rep-stat"><div className="rep-stat-val" style={{ color: '#dc2626' }}>{rejected}</div><div className="rep-stat-lbl">Rejected</div></div>
          </div>
          {leaves.length === 0 ? <p style={{ color: '#94a3b8', marginTop: 16 }}>No leave records found.</p> : (
            <table className="rep-table">
              <thead><tr><th>Employee</th><th>Type</th><th>Days</th><th>Status</th></tr></thead>
              <tbody>
                {[...leaves].reverse().map((l) => (
                  <tr key={l.id}><td>{l.empName}</td><td>{l.type}</td><td>{l.days}</td><td><span className={`badge badge-${l.status === 'Approved' ? 'success' : l.status === 'Rejected' ? 'danger' : 'warning'}`}>{l.status}</span></td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
    },
  };

  return (
    <div className="rep-page">
      <div className="page-header">
        <h1>Reports</h1>
        <span style={{ color: '#64748b', fontSize: 14 }}>Live data from system records</span>
      </div>
      <div className="rep-tabs">
        {reportTypes.map((rt) => (
          <button key={rt.id} className={`rep-tab ${active === rt.id ? 'active' : ''}`} onClick={() => setActive(rt.id)}>
            <span>{rt.icon}</span>
            <div><div className="rep-tab-label">{rt.label}</div><div className="rep-tab-desc">{rt.desc}</div></div>
          </button>
        ))}
      </div>
      {r[active]()}
    </div>
  );
}

export default Reports;

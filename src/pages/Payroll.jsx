import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, calcSalaryBreakdown } from '../utils/helper';
import './Payroll.css';

const employees = [
  { id: 1, name: 'Rahul Sharma', position: 'Senior Developer', department: 'Engineering', salary: 1800000, bankAccount: 'XXXX-XXXX-4821', pan: 'ABCDE1234F' },
  { id: 2, name: 'Priya Verma', position: 'Marketing Lead', department: 'Marketing', salary: 1400000, bankAccount: 'XXXX-XXXX-3720', pan: 'FGHIJ5678K' },
  { id: 3, name: 'Amit Singh', position: 'Full Stack Developer', department: 'Engineering', salary: 1200000, bankAccount: 'XXXX-XXXX-2591', pan: 'KLMNO9012P' },
  { id: 4, name: 'Sneha Patel', position: 'HR Manager', department: 'HR', salary: 1100000, bankAccount: 'XXXX-XXXX-1473', pan: 'PQRST3456U' },
  { id: 5, name: 'Vikram Reddy', position: 'Accountant', department: 'Finance', salary: 950000, bankAccount: 'XXXX-XXXX-8364', pan: 'UVWXY7890Z' },
  { id: 6, name: 'Ananya Gupta', position: 'Content Strategist', department: 'Marketing', salary: 850000, bankAccount: 'XXXX-XXXX-5267', pan: 'ABCDE1111A' },
  { id: 7, name: 'Arjun Nair', position: 'DevOps Engineer', department: 'Engineering', salary: 1600000, bankAccount: 'XXXX-XXXX-9324', pan: 'FGHIJ2222B' },
  { id: 8, name: 'Divya Joshi', position: 'Sales Manager', department: 'Sales', salary: 1300000, bankAccount: 'XXXX-XXXX-6185', pan: 'KLMNO3333C' },
  { id: 9, name: 'Karan Mehta', position: 'Frontend Developer', department: 'Engineering', salary: 1000000, bankAccount: 'XXXX-XXXX-7492', pan: 'PQRST4444D' },
  { id: 10, name: 'Isha Kapoor', position: 'Recruiter', department: 'HR', salary: 700000, bankAccount: 'XXXX-XXXX-3851', pan: 'UVWXY5555E' },
  { id: 11, name: 'Rohit Desai', position: 'Financial Analyst', department: 'Finance', salary: 1050000, bankAccount: 'XXXX-XXXX-6273', pan: 'ABCDE6666F' },
  { id: 12, name: 'Neha Agarwal', position: 'Sales Executive', department: 'Sales', salary: 800000, bankAccount: 'XXXX-XXXX-1948', pan: 'FGHIJ7777G' },
];

const currentMonth = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

function Payroll() {
  const { user } = useAuth();
  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('payrollPayments');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [payMode, setPayMode] = useState('Bank Transfer');

  const empPayments = {};
  payments.forEach((p) => { empPayments[p.empId] = p; });

  const handlePay = (emp) => {
    const breakdown = calcSalaryBreakdown(emp.salary);
    const payment = {
      id: Date.now(),
      empId: emp.id,
      name: emp.name,
      position: emp.position,
      department: emp.department,
      salary: emp.salary,
      month: currentMonth,
      paidDate: new Date().toLocaleDateString('en-IN'),
      payMode,
      ...breakdown,
    };
    const updated = [...payments.filter((p) => p.empId !== emp.id), payment];
    setPayments(updated);
    localStorage.setItem('payrollPayments', JSON.stringify(updated));
    setSelectedEmp(null);
  };

  const totalSalary = employees.reduce((s, e) => s + e.salary, 0);
  const totalPaid = payments.reduce((s, p) => s + p.monthlyNet, 0);
  const totalTds = employees.reduce((s, e) => s + calcSalaryBreakdown(e.salary).tds, 0);

  return (
    <div className="payroll-page">
      <div className="page-header">
        <h1>Payroll</h1>
        <span style={{ color: '#64748b', fontSize: 14 }}>{currentMonth}</span>
      </div>

      <div className="pay-summary">
        <div className="card pay-summary-card">
          <div className="pay-summary-val" style={{ color: '#6366f1' }}>{formatCurrency(totalSalary)}</div>
          <div className="pay-summary-lbl">Annual Salary Budget</div>
        </div>
        <div className="card pay-summary-card">
          <div className="pay-summary-val" style={{ color: '#0f9d58' }}>{formatCurrency(totalPaid)}</div>
          <div className="pay-summary-lbl">Paid This Month</div>
        </div>
        <div className="card pay-summary-card">
          <div className="pay-summary-val" style={{ color: '#dc2626' }}>{formatCurrency(totalTds)}</div>
          <div className="pay-summary-lbl">Annual TDS Liability</div>
        </div>
        <div className="card pay-summary-card">
          <div className="pay-summary-val" style={{ color: '#f4b400' }}>{payments.length}/{employees.length}</div>
          <div className="pay-summary-lbl">Employees Paid</div>
        </div>
      </div>

      <div className="card pay-table-card">
        <h3 className="pay-section-title">Salary & Payment Processing</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Position</th>
                <th>Annual CTC</th>
                <th>Monthly Net</th>
                <th>Monthly TDS</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const breakdown = calcSalaryBreakdown(emp.salary);
                const paid = empPayments[emp.id];
                return (
                  <tr key={emp.id}>
                    <td><strong>{emp.name}</strong></td>
                    <td style={{ color: '#64748b', fontSize: 13 }}>{emp.position}</td>
                    <td>{formatCurrency(emp.salary)}</td>
                    <td>{formatCurrency(breakdown.monthlyNet)}</td>
                    <td style={{ color: '#dc2626' }}>{formatCurrency(breakdown.monthlyTds)}</td>
                    <td>
                      {paid ? (
                        <span className="badge badge-success">Paid</span>
                      ) : (
                        <span className="badge badge-warning">Pending</span>
                      )}
                    </td>
                    <td>
                      {paid ? (
                        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setSelectedEmp(selectedEmp?.id === emp.id ? null : emp)}>
                          View Slip
                        </button>
                      ) : user?.role === 'admin' ? (
                        <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setSelectedEmp(selectedEmp?.id === emp.id ? null : emp)}>
                          Pay Now
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>Awaiting</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEmp && (
        <div className="modal-overlay" onClick={() => setSelectedEmp(null)}>
          <div className="pay-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pay-modal-close" onClick={() => setSelectedEmp(null)}>✕</button>

            {empPayments[selectedEmp.id] ? (
              <div className="pay-payslip">
                <div className="pay-payslip-header">
                  <div>
                    <h2 style={{ fontSize: 18, color: '#6366f1' }}>EMS Pvt. Ltd.</h2>
                    <p style={{ fontSize: 12, color: '#64748b' }}>Employee Management Systems</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#0f9d58' }}>{formatCurrency(empPayments[selectedEmp.id].monthlyNet)}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Net Pay for {currentMonth}</div>
                  </div>
                </div>

                <div className="pay-payslip-body">
                  <div className="pay-payslip-info">
                    <div className="pay-info-row"><span>Employee</span><span>{selectedEmp.name}</span></div>
                    <div className="pay-info-row"><span>PAN</span><span>{selectedEmp.pan}</span></div>
                    <div className="pay-info-row"><span>Bank Account</span><span>{selectedEmp.bankAccount}</span></div>
                    <div className="pay-info-row"><span>Department</span><span>{selectedEmp.department}</span></div>
                    <div className="pay-info-row"><span>Designation</span><span>{selectedEmp.position}</span></div>
                    <div className="pay-info-row"><span>Pay Date</span><span>{empPayments[selectedEmp.id].paidDate}</span></div>
                    <div className="pay-info-row"><span>Payment Mode</span><span>{empPayments[selectedEmp.id].payMode}</span></div>
                  </div>

                  <div className="pay-breakdown">
                    <h4 style={{ marginBottom: 12, fontSize: 14, color: '#0f1724' }}>Earnings</h4>
                    <div className="pay-bd-row earn"><span>Basic Salary</span><span>{formatCurrency(empPayments[selectedEmp.id].basic / 12)}</span></div>
                    <div className="pay-bd-row earn"><span>HRA</span><span>{formatCurrency(empPayments[selectedEmp.id].hra / 12)}</span></div>
                    <div className="pay-bd-row earn"><span>Dearness Allowance</span><span>{formatCurrency(empPayments[selectedEmp.id].da / 12)}</span></div>
                    <div className="pay-bd-row earn"><span>Other Allowances</span><span>{formatCurrency(empPayments[selectedEmp.id].otherAllowances / 12)}</span></div>

                    <h4 style={{ margin: '16px 0 12px', fontSize: 14, color: '#0f1724' }}>Deductions</h4>
                    <div className="pay-bd-row deduct"><span>Provident Fund (PF)</span><span>-{formatCurrency(empPayments[selectedEmp.id].pf)}</span></div>
                    <div className="pay-bd-row deduct"><span>TDS (Income Tax)</span><span>-{formatCurrency(empPayments[selectedEmp.id].monthlyTds)}</span></div>

                    <div className="pay-bd-row total">
                      <span>Net Payable</span>
                      <span style={{ color: '#0f9d58', fontWeight: 700 }}>{formatCurrency(empPayments[selectedEmp.id].monthlyNet)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pay-process">
                <h3 style={{ marginBottom: 16 }}>Process Payment</h3>
                <div className="pay-emp-info">
                  <img src={`https://ui-avatars.com/api/?name=${selectedEmp.name.replace(' ', '+')}&background=6366f1&color=fff&size=48`} alt="" className="pay-emp-avatar" />
                  <div>
                    <div style={{ fontWeight: 600 }}>{selectedEmp.name}</div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>{selectedEmp.position}</div>
                  </div>
                </div>
                <div className="pay-details">
                  {(() => {
                    const bd = calcSalaryBreakdown(selectedEmp.salary);
                    return (
                      <>
                        <div className="pay-detail-row"><span>Annual CTC</span><span>{formatCurrency(bd.annual)}</span></div>
                        <div className="pay-detail-row"><span>Monthly Gross</span><span>{formatCurrency(bd.monthlyGross)}</span></div>
                        <div className="pay-detail-row"><span>PF Deduction</span><span style={{ color: '#dc2626' }}>-{formatCurrency(bd.pf)}</span></div>
                        <div className="pay-detail-row"><span>Monthly TDS</span><span style={{ color: '#dc2626' }}>-{formatCurrency(bd.monthlyTds)}</span></div>
                        <div className="pay-detail-row" style={{ borderTop: '2px solid #e2e8f0', paddingTop: 10, marginTop: 10, fontWeight: 700 }}>
                          <span>Net Payable</span>
                          <span style={{ color: '#0f9d58', fontSize: 18 }}>{formatCurrency(bd.monthlyNet)}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="form-group" style={{ marginTop: 16 }}>
                  <label>Payment Mode</label>
                  <select value={payMode} onChange={(e) => setPayMode(e.target.value)}>
                    <option>Bank Transfer</option>
                    <option>Cheque</option>
                    <option>Cash</option>
                  </select>
                </div>
                <button className="btn btn-success" style={{ width: '100%', marginTop: 12 }} onClick={() => handlePay(selectedEmp)}>
                  Confirm Payment — {formatCurrency(calcSalaryBreakdown(selectedEmp.salary).monthlyNet)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Payroll;

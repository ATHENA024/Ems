import React from 'react';

const shiftColors = {
  Morning: '#6366f1',
  Evening: '#f59e0b',
  Night: '#1e293b',
};

function EmployeeTable({ employees, onEdit, onDelete, isAdmin = true }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Email</th>
            <th>Department</th>
            <th>Shift</th>
            <th>Position</th>
            <th>Status</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={emp.avatar || `https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=6366f1&color=fff&size=32`}
                    alt={emp.firstName}
                    style={{ width: 32, height: 32, borderRadius: '50%' }}
                  />
                  <span style={{ fontWeight: 500 }}>{emp.firstName} {emp.lastName}</span>
                </div>
              </td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>
                <span style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 500,
                  background: `${shiftColors[emp.shift] || '#6366f1'}15`,
                  color: shiftColors[emp.shift] || '#6366f1',
                }}>
                  {emp.shift || 'Morning'}
                </span>
              </td>
              <td style={{ color: '#64748b', fontSize: 13 }}>{emp.position}</td>
              <td>
                <span className={`badge badge-${emp.status === 'Active' ? 'success' : 'danger'}`}>
                  {emp.status}
                </span>
              </td>
              {isAdmin && (
                <td>
                  <button className="btn btn-primary" style={{ marginRight: 8, padding: '6px 14px', fontSize: 12 }} onClick={() => onEdit(emp)}>Edit</button>
                  <button className="btn btn-danger" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => onDelete(emp.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
          {employees.length === 0 && (
            <tr>
              <td colSpan={isAdmin ? "7" : "6"} style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;

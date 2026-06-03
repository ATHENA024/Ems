import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmployeeContext } from '../context/EmployeeContext';
import EmployeeTable from '../components/Employee/EmployeeTable';
import EmployeeForm from '../components/Employee/EmployeeForm';
import { formatCurrency } from '../utils/helper';

function Employees() {
  const { user } = useAuth();
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployeeContext();
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const handleAdd = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(id);
    }
  };

  const handleSubmit = (formData) => {
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, formData);
    } else {
      addEmployee(formData);
    }
    setShowForm(false);
    setEditingEmployee(null);
  };

  const activeCount = employees.filter((e) => e.status === 'Active').length;
  const totalSalary = employees.reduce((sum, e) => sum + Number(e.salary || 0), 0);
  const shiftCounts = { Morning: employees.filter((e) => e.shift === 'Morning').length, Evening: employees.filter((e) => e.shift === 'Evening').length, Night: employees.filter((e) => e.shift === 'Night').length };

  return (
    <div>
      <div className="page-header">
        <h1>Employees</h1>
        {user?.role === 'admin' && <button className="btn btn-primary" onClick={handleAdd}>+ Add Employee</button>}
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, minWidth: 120, textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#6366f1' }}>{employees.length}</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>Total</div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: 120, textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#0f9d58' }}>{activeCount}</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>Active</div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: 120, textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>{shiftCounts.Morning}</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>Morning</div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: 120, textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#6366f1' }}>{shiftCounts.Evening}</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>Evening</div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: 120, textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{shiftCounts.Night}</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>Night</div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: 120, textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0f9d58' }}>{formatCurrency(totalSalary)}</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>Total Salary</div>
        </div>
      </div>
      <div className="card">
        <EmployeeTable employees={employees} onEdit={handleEdit} onDelete={handleDelete} isAdmin={user?.role === 'admin'} />
      </div>
      {showForm && (
        <EmployeeForm employee={editingEmployee} onSubmit={handleSubmit} onCancel={() => { setShowForm(false); setEditingEmployee(null); }} />
      )}
    </div>
  );
}

export default Employees;

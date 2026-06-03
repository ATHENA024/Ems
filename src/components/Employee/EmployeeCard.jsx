import React from 'react';
import './EmployeeCard.css';

function EmployeeCard({ employee, onEdit, onDelete }) {
  return (
    <div className="employee-card card">
      <div className="employee-card-header">
        <img
          src={employee.avatar || `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=1a73e8&color=fff`}
          alt={`${employee.firstName} ${employee.lastName}`}
          className="employee-card-avatar"
        />
        <div className="employee-card-info">
          <h4>{employee.firstName} {employee.lastName}</h4>
          <span className="employee-card-role">{employee.position}</span>
        </div>
      </div>
      <div className="employee-card-body">
        <div className="employee-card-detail">
          <span className="label">Email</span>
          <span>{employee.email}</span>
        </div>
        <div className="employee-card-detail">
          <span className="label">Department</span>
          <span>{employee.department}</span>
        </div>
        <div className="employee-card-detail">
          <span className="label">Status</span>
          <span className={`badge badge-${employee.status === 'Active' ? 'success' : 'danger'}`}>
            {employee.status}
          </span>
        </div>
      </div>
      <div className="employee-card-actions">
        <button className="btn btn-primary" onClick={() => onEdit(employee)}>Edit</button>
        <button className="btn btn-danger" onClick={() => onDelete(employee.id)}>Delete</button>
      </div>
    </div>
  );
}

export default EmployeeCard;

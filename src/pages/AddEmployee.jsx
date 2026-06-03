import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployeeContext } from '../context/EmployeeContext';
import EmployeeForm from '../components/Employee/EmployeeForm';

function AddEmployee() {
  const navigate = useNavigate();
  const { addEmployee } = useEmployeeContext();

  const handleSubmit = (formData) => {
    addEmployee(formData);
    navigate('/employees');
  };

  return (
    <div>
      <div className="page-header">
        <h1>Add Employee</h1>
      </div>
      <div className="card">
        <EmployeeForm onSubmit={handleSubmit} onCancel={() => navigate('/employees')} />
      </div>
    </div>
  );
}

export default AddEmployee;

import React, { useState, useEffect } from 'react';

const initialFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  salary: '',
  shift: 'Morning',
  joinDate: '',
  status: 'Active',
};

function EmployeeForm({ employee, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || '',
        position: employee.position || '',
        salary: employee.salary || '',
        shift: employee.shift || 'Morning',
        joinDate: employee.joinDate || '',
        status: employee.status || 'Active',
      });
    } else {
      setFormData(initialFormState);
    }
  }, [employee]);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 540 }}>
        <h2>{employee ? 'Edit Employee' : 'Add Employee'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>First Name</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} />
              {errors.firstName && <small style={{ color: '#dc2626' }}>{errors.firstName}</small>}
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Last Name</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} />
              {errors.lastName && <small style={{ color: '#dc2626' }}>{errors.lastName}</small>}
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} />
            {errors.email && <small style={{ color: '#dc2626' }}>{errors.email}</small>}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Join Date</label>
              <input name="joinDate" type="date" value={formData.joinDate} onChange={handleChange} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Department</label>
              <select name="department" value={formData.department} onChange={handleChange}>
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
              {errors.department && <small style={{ color: '#dc2626' }}>{errors.department}</small>}
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Shift</label>
              <select name="shift" value={formData.shift} onChange={handleChange}>
                <option value="Morning">Morning (6AM-2PM)</option>
                <option value="Evening">Evening (2PM-10PM)</option>
                <option value="Night">Night (10PM-6AM)</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Position</label>
              <input name="position" value={formData.position} onChange={handleChange} />
              {errors.position && <small style={{ color: '#dc2626' }}>{errors.position}</small>}
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Salary (Annual)</label>
              <input name="salary" type="number" value={formData.salary} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {employee ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;

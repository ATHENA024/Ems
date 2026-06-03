import React, { createContext, useContext, useState, useCallback } from 'react';

const EmployeeContext = createContext(null);

const initialEmployees = [
  { id: 1, firstName: 'Rahul', lastName: 'Sharma', email: 'rahul.sharma@example.com', phone: '9876543210', department: 'Engineering', position: 'Senior Developer', salary: 1800000, shift: 'Morning', joinDate: '2022-01-15', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=emp-1' },
  { id: 2, firstName: 'Priya', lastName: 'Verma', email: 'priya.verma@example.com', phone: '9876543211', department: 'Marketing', position: 'Marketing Lead', salary: 1400000, shift: 'Morning', joinDate: '2021-06-01', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=emp-2' },
  { id: 3, firstName: 'Amit', lastName: 'Singh', email: 'amit.singh@example.com', phone: '9876543212', department: 'Engineering', position: 'Full Stack Developer', salary: 1200000, shift: 'Evening', joinDate: '2023-03-10', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=emp-3' },
  { id: 4, firstName: 'Sneha', lastName: 'Patel', email: 'sneha.patel@example.com', phone: '9876543213', department: 'HR', position: 'HR Manager', salary: 1100000, shift: 'Morning', joinDate: '2020-11-20', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=emp-4' },
  { id: 5, firstName: 'Vikram', lastName: 'Reddy', email: 'vikram.reddy@example.com', phone: '9876543214', department: 'Finance', position: 'Accountant', salary: 950000, shift: 'Morning', joinDate: '2022-08-05', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=emp-5' },
  { id: 6, firstName: 'Ananya', lastName: 'Gupta', email: 'ananya.gupta@example.com', phone: '9876543215', department: 'Marketing', position: 'Content Strategist', salary: 850000, shift: 'Evening', joinDate: '2023-09-12', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=emp-6' },
  { id: 7, firstName: 'Arjun', lastName: 'Nair', email: 'arjun.nair@example.com', phone: '9876543216', department: 'Engineering', position: 'DevOps Engineer', salary: 1600000, shift: 'Night', joinDate: '2021-12-01', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=emp-7' },
  { id: 8, firstName: 'Divya', lastName: 'Joshi', email: 'divya.joshi@example.com', phone: '9876543217', department: 'Sales', position: 'Sales Manager', salary: 1300000, shift: 'Morning', joinDate: '2022-04-18', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=emp-8' },
  { id: 9, firstName: 'Karan', lastName: 'Mehta', email: 'karan.mehta@example.com', phone: '9876543218', department: 'Engineering', position: 'Frontend Developer', salary: 1000000, shift: 'Morning', joinDate: '2023-06-22', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=emp-9' },
  { id: 10, firstName: 'Isha', lastName: 'Kapoor', email: 'isha.kapoor@example.com', phone: '9876543219', department: 'HR', position: 'Recruiter', salary: 700000, shift: 'Morning', joinDate: '2024-01-08', status: 'Inactive', avatar: 'https://i.pravatar.cc/150?u=emp-10' },
  { id: 11, firstName: 'Rohit', lastName: 'Desai', email: 'rohit.desai@example.com', phone: '9876543220', department: 'Finance', position: 'Financial Analyst', salary: 1050000, shift: 'Evening', joinDate: '2022-10-30', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=emp-11' },
  { id: 12, firstName: 'Neha', lastName: 'Agarwal', email: 'neha.agarwal@example.com', phone: '9876543221', department: 'Sales', position: 'Sales Executive', salary: 800000, shift: 'Night', joinDate: '2023-07-15', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=emp-12' },
  { id: 13, firstName: 'Employee', lastName: 'User', email: 'employee@ems.com', phone: '9876543222', department: 'Engineering', position: 'Software Developer', salary: 900000, shift: 'Morning', joinDate: '2024-01-01', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=emp-13' },
];

export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState(initialEmployees);

  const addEmployee = useCallback((employee) => {
    setEmployees((prev) => [...prev, { ...employee, id: Date.now(), salary: Number(employee.salary) }]);
  }, []);

  const updateEmployee = useCallback((id, updatedData) => {
    setEmployees((prev) => prev.map((emp) =>
      emp.id === id ? { ...emp, ...updatedData, salary: Number(updatedData.salary ?? emp.salary) } : emp
    ));
  }, []);

  const deleteEmployee = useCallback((id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  }, []);

  const getEmployeeById = useCallback((id) => {
    return employees.find((emp) => emp.id === id);
  }, [employees]);

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, updateEmployee, deleteEmployee, getEmployeeById }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployeeContext() {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployeeContext must be used within an EmployeeProvider');
  }
  return context;
}

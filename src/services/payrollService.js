import api from './api';

export const payrollService = {
  getAll: async () => {
    const response = await api.get('/payroll');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/payroll/${id}`);
    return response.data;
  },

  processPayroll: async (payrollData) => {
    const response = await api.post('/payroll', payrollData);
    return response.data;
  },

  getByEmployee: async (employeeId) => {
    const response = await api.get(`/payroll/employee/${employeeId}`);
    return response.data;
  },
};

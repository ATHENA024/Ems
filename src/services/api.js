import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const leaveService = {
  getAll: async (params = {}) => {
    const response = await api.get('/leaves', { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/leaves', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/leaves/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/leaves/${id}`);
    return response.data;
  },
};

export const payrollService = {
  getAll: async (params = {}) => {
    const response = await api.get('/payroll', { params });
    return response.data;
  },
  process: async (data) => {
    const response = await api.post('/payroll', data);
    return response.data;
  },
  calculate: async (empId) => {
    const response = await api.get(`/payroll/calculate/${empId}`);
    return response.data;
  },
};

export const performanceService = {
  getAll: async (params = {}) => {
    const response = await api.get('/performance', { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/performance', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/performance/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/performance/${id}`);
    return response.data;
  },
};

export const appraisalService = {
  getAll: async (params = {}) => {
    const response = await api.get('/appraisals', { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/appraisals', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/appraisals/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/appraisals/${id}`);
    return response.data;
  },
};

export const onboardingService = {
  getAll: async () => {
    const response = await api.get('/onboarding');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/onboarding', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/onboarding/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/onboarding/${id}`);
    return response.data;
  },
};

export const lmsService = {
  getAll: async () => {
    const response = await api.get('/lms');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/lms', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/lms/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/lms/${id}`);
    return response.data;
  },
};

export const announcementService = {
  getAll: async () => {
    const response = await api.get('/announcements');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/announcements', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/announcements/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  },
};

export const helpdeskService = {
  getAll: async () => {
    const response = await api.get('/helpdesk');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/helpdesk', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/helpdesk/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/helpdesk/${id}`);
    return response.data;
  },
};

export const reportService = {
  getSummary: async () => {
    const response = await api.get('/reports/summary');
    return response.data;
  },
  getEmployeeData: async (empId) => {
    const response = await api.get(`/reports/employee/${empId}`);
    return response.data;
  },
};

export default api;

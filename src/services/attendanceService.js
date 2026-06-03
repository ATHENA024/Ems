import api from './api';

export const attendanceService = {
  getAll: async () => {
    const response = await api.get('/attendance');
    return response.data;
  },

  markAttendance: async (attendanceData) => {
    const response = await api.post('/attendance', attendanceData);
    return response.data;
  },

  getByEmployee: async (employeeId) => {
    const response = await api.get(`/attendance/employee/${employeeId}`);
    return response.data;
  },

  getByDate: async (date) => {
    const response = await api.get(`/attendance/date/${date}`);
    return response.data;
  },
};

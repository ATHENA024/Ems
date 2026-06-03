import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

function generateEmployeeId(role) {
  const prefix = role === 'admin' ? 'ADM' : 'EMP';
  const stored = localStorage.getItem('userIdCounter');
  let counter = stored ? parseInt(stored, 10) : 3;
  counter += 1;
  localStorage.setItem('userIdCounter', counter.toString());
  return `${prefix}-${String(counter).padStart(4, '0')}`;
}

const DEMO_USERS = {
  'ADM-0001': { id: 1, employeeId: 'ADM-0001', email: 'admin@ems.com', name: 'Admin User', role: 'admin', department: '', permissions: ['add_employee', 'edit_employee', 'delete_employee', 'manage_users'], password: 'admin123' },
  'ADM-0002': { id: 2, employeeId: 'ADM-0002', email: 'sectionadmin@ems.com', name: 'Section Admin', role: 'section_admin', department: 'Engineering', permissions: ['add_employee', 'edit_employee'], password: 'sec123' },
  'EMP-0001': { id: 3, employeeId: 'EMP-0001', email: 'employee@ems.com', name: 'Employee User', role: 'employee', department: '', permissions: [], password: 'emp123' },
};

function getRegisteredUsers() {
  try {
    const stored = localStorage.getItem('registeredUsers');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users) {
  localStorage.setItem('registeredUsers', JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (employeeId, password) => {
    try {
      const response = await api.post('/auth/login', { employeeId, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch {
      const id = employeeId.toUpperCase();
      const demoUser = DEMO_USERS[id];
      if (demoUser && password === demoUser.password) {
        const { password: _, ...safeUser } = demoUser;
        localStorage.setItem('user', JSON.stringify(safeUser));
        setUser(safeUser);
        return safeUser;
      }

      const registered = getRegisteredUsers();
      const found = registered.find(u => u.employeeId.toUpperCase() === id);
      if (found && password === found.password) {
        const { password: _, ...safeUser } = found;
        localStorage.setItem('user', JSON.stringify(safeUser));
        setUser(safeUser);
        return safeUser;
      }

      throw new Error('Invalid Employee ID or password');
    }
  };

  const register = async (data) => {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch {
      const registered = getRegisteredUsers();
      if (registered.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error('An account with this email already exists');
      }

      const employeeId = generateEmployeeId(data.role || 'employee');
      const newUser = {
        id: Date.now(),
        employeeId,
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role || 'employee',
        department: data.department || '',
        position: data.position || '',
        phone: data.phone || '',
        permissions: data.role === 'admin' ? ['add_employee', 'edit_employee', 'delete_employee', 'manage_users'] : [],
      };

      registered.push(newUser);
      saveRegisteredUsers(registered);

      const { password: _, ...safeUser } = newUser;
      return { message: 'Registration successful!', user: safeUser, employeeId };
    }
  };

  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return (user.permissions || []).includes(permission);
  }, [user]);

  const updateUserAvatar = useCallback((avatar) => {
    const updated = { ...user, avatar };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  }, [user]);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, hasPermission, updateUserAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

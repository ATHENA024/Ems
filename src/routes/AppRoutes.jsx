import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import Footer from '../components/Footer/Footer';
import Login from '../pages/Login';
import Register from '../pages/Register';
import EmployeeLogin from '../pages/EmployeeLogin';
import EmployeeRegister from '../pages/EmployeeRegister';
import Dashboard from '../pages/Dashboard';
import EmployeeDashboard from '../pages/EmployeeDashboard';
import Employees from '../pages/Employees';
import AddEmployee from '../pages/AddEmployee';
import Onboarding from '../pages/Onboarding';
import LMS from '../pages/LMS';
import Performance from '../pages/Performance';
import Appraisals from '../pages/Appraisals';
import Attendance from '../pages/Attendance';
import Payroll from '../pages/Payroll';
import LeaveManagement from '../pages/LeaveManagement';
import Announcements from '../pages/Announcements';
import Helpdesk from '../pages/Helpdesk';
import SelfService from '../pages/SelfService';
import Security from '../pages/Security';
import Reports from '../pages/Reports';
import Profile from '../pages/Profile';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/employee-dashboard" replace />;
  return children;
}

function AppLayout({ children }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userAvatar = user?.name ? `https://i.pravatar.cc/150?u=${user.name.replace(/\s+/g, '-')}` : undefined;

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} userName={user?.name} userAvatar={userAvatar} />
        <div className="page-content">{children}</div>
        <Footer />
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  function HomeRedirect() {
    if (!user) return <Navigate to="/login" replace />;
    return <Navigate to={user.role === 'admin' ? '/dashboard' : '/employee-dashboard'} replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/employee/login" element={<EmployeeLogin />} />
      <Route path="/employee/register" element={<EmployeeRegister />} />
      <Route path="/dashboard" element={<AdminRoute><AppLayout><Dashboard /></AppLayout></AdminRoute>} />
      <Route path="/employee-dashboard" element={<PrivateRoute><AppLayout><EmployeeDashboard /></AppLayout></PrivateRoute>} />
      <Route path="/employees" element={<AdminRoute><AppLayout><Employees /></AppLayout></AdminRoute>} />
      <Route path="/add-employee" element={<AdminRoute><AppLayout><AddEmployee /></AppLayout></AdminRoute>} />
      <Route path="/onboarding" element={<AdminRoute><AppLayout><Onboarding /></AppLayout></AdminRoute>} />
      <Route path="/lms" element={<PrivateRoute><AppLayout><LMS /></AppLayout></PrivateRoute>} />
      <Route path="/performance" element={<PrivateRoute><AppLayout><Performance /></AppLayout></PrivateRoute>} />
      <Route path="/appraisals" element={<PrivateRoute><AppLayout><Appraisals /></AppLayout></PrivateRoute>} />
      <Route path="/attendance" element={<PrivateRoute><AppLayout><Attendance /></AppLayout></PrivateRoute>} />
      <Route path="/payroll" element={<AdminRoute><AppLayout><Payroll /></AppLayout></AdminRoute>} />
      <Route path="/leave-management" element={<PrivateRoute><AppLayout><LeaveManagement /></AppLayout></PrivateRoute>} />
      <Route path="/announcements" element={<PrivateRoute><AppLayout><Announcements /></AppLayout></PrivateRoute>} />
      <Route path="/helpdesk" element={<PrivateRoute><AppLayout><Helpdesk /></AppLayout></PrivateRoute>} />
      <Route path="/self-service" element={<PrivateRoute><AppLayout><SelfService /></AppLayout></PrivateRoute>} />
      <Route path="/security" element={<AdminRoute><AppLayout><Security /></AppLayout></AdminRoute>} />
      <Route path="/reports" element={<AdminRoute><AppLayout><Reports /></AppLayout></AdminRoute>} />
      <Route path="/profile" element={<PrivateRoute><AppLayout><Profile /></AppLayout></PrivateRoute>} />
      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}

export default AppRoutes;

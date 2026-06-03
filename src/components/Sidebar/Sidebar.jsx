import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const menuItems = [
  { path: '/dashboard', label: 'Admin Dashboard', icon: '📊', roles: ['admin'] },
  { path: '/employee-dashboard', label: 'My Dashboard', icon: '📋', roles: ['admin', 'employee'] },
  { path: '/employees', label: 'Employees', icon: '👥', roles: ['admin'] },
  { path: '/onboarding', label: 'Onboarding', icon: '🚀', roles: ['admin'] },
  { path: '/lms', label: 'LMS', icon: '🎓', roles: ['admin', 'employee'] },
  { path: '/performance', label: 'Performance', icon: '🎯', roles: ['admin', 'employee'] },
  { path: '/appraisals', label: 'Appraisals', icon: '⭐', roles: ['admin', 'employee'] },
  { path: '/attendance', label: 'Attendance', icon: '⏰', roles: ['admin', 'employee'] },
  { path: '/payroll', label: 'Payroll', icon: '💰', roles: ['admin'] },
  { path: '/leave-management', label: 'Leave', icon: '🏖️', roles: ['admin', 'employee'] },
  { path: '/announcements', label: 'Announcements', icon: '📢', roles: ['admin', 'employee'] },
  { path: '/helpdesk', label: 'Helpdesk', icon: '🎫', roles: ['admin', 'employee'] },
  { path: '/self-service', label: 'Self Service', icon: '🛠️', roles: ['admin', 'employee'] },
  { path: '/security', label: 'Security', icon: '🔒', roles: ['admin'] },
  { path: '/reports', label: 'Reports', icon: '📈', roles: ['admin'] },
  { path: '/profile', label: 'Profile', icon: '👤', roles: ['admin', 'employee'] },
];

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const filteredItems = menuItems.filter((item) => item.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="8" fill="#6366f1"/>
              <path d="M10 26V14l8-6 8 6v12h-5v-8h-6v8H10z" fill="#fff"/>
              <rect x="14" y="18" width="8" height="8" rx="2" fill="#c7d2fe"/>
            </svg>
          </div>
          <h3>EMS</h3>
        </div>
        <nav className="sidebar-nav">
          {filteredItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-link logout" onClick={handleLogout}>
            <span className="sidebar-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEmployeeContext } from '../../context/EmployeeContext';
import './Navbar.css';

const notifications = [
  { id: 1, text: 'New leave request from Sneha Patel', time: '5 min ago', unread: true },
  { id: 2, text: 'Payroll for June is processing', time: '1 hr ago', unread: true },
  { id: 3, text: 'Rahul Sharma marked attendance', time: '2 hr ago', unread: false },
  { id: 4, text: 'Karan Mehta updated profile', time: '1 day ago', unread: false },
];

function Navbar({ onToggleSidebar, userName }) {
  const [showNotif, setShowNotif] = useState(false);
  const [notifList, setNotifList] = useState(notifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { user } = useAuth();
  const { employees } = useEmployeeContext();
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredEmployees = searchQuery.trim()
    ? employees.filter((emp) => {
        const q = searchQuery.toLowerCase();
        return (
          emp.firstName.toLowerCase().includes(q) ||
          emp.lastName.toLowerCase().includes(q) ||
          `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(q) ||
          emp.email.toLowerCase().includes(q) ||
          emp.department.toLowerCase().includes(q) ||
          emp.position.toLowerCase().includes(q)
        );
      })
    : [];

  const unreadCount = notifList.filter((n) => n.unread).length;

  const handleMarkRead = (id) => {
    setNotifList((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n));
  };

  const handleMarkAllRead = () => {
    setNotifList((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="navbar-toggle" onClick={onToggleSidebar}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div className="navbar-search" ref={searchRef}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSearchResults(true); }}
            onFocus={() => setShowSearchResults(true)}
          />
          {showSearchResults && filteredEmployees.length > 0 && (
            <div className="navbar-search-dropdown">
              {filteredEmployees.slice(0, 8).map((emp) => (
                <div
                  key={emp.id}
                  className="navbar-search-item"
                  onClick={() => { setSearchQuery(''); setShowSearchResults(false); navigate('/employees'); }}
                >
                  <img
                    src={emp.avatar || `https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=6366f1&color=fff&size=28`}
                    alt={emp.firstName}
                    className="navbar-search-avatar"
                  />
                  <div className="navbar-search-info">
                    <span className="navbar-search-name">{emp.firstName} {emp.lastName}</span>
                    <span className="navbar-search-meta">{emp.department} • {emp.position}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {showSearchResults && searchQuery.trim() && filteredEmployees.length === 0 && (
            <div className="navbar-search-dropdown">
              <div className="navbar-search-empty">No employees found</div>
            </div>
          )}
        </div>
      </div>
      <div className="navbar-right">
        <div className="navbar-notif" ref={notifRef}>
          <button className="navbar-notif-btn" onClick={() => setShowNotif((prev) => !prev)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unreadCount > 0 && <span className="navbar-notif-badge">{unreadCount}</span>}
          </button>
          {showNotif && (
            <div className="navbar-notif-dropdown">
              <div className="navbar-notif-header">
                <span>Notifications</span>
                {unreadCount > 0 && <button className="navbar-notif-markall" onClick={handleMarkAllRead}>Mark all read</button>}
              </div>
              <div className="navbar-notif-list">
                {notifList.map((n) => (
                  <div key={n.id} className={`navbar-notif-item ${n.unread ? 'unread' : ''}`} onClick={() => handleMarkRead(n.id)}>
                    <div className="navbar-notif-dot"></div>
                    <div className="navbar-notif-content">
                      <div className="navbar-notif-text">{n.text}</div>
                      <div className="navbar-notif-time">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="navbar-profile">
          <img
            src={`https://ui-avatars.com/api/?name=${userName || 'Admin+User'}&background=6366f1&color=fff`}
            alt="Profile"
            className="navbar-avatar"
          />
          <div className="navbar-profile-info">
            <span className="navbar-username">{userName || 'Admin'}</span>
            <span className="navbar-userid">{user?.employeeId || ''}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

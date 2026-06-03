import React from 'react';
import './DashboardCard.css';

function DashboardCard({ title, value, icon, color }) {
  return (
    <div className="dashboard-card card">
      <div className="dashboard-card-icon" style={{ background: `${color}15`, color: color }}>
        {icon}
      </div>
      <div className="dashboard-card-content">
        <span className="dashboard-card-title">{title}</span>
        <span className="dashboard-card-value">{value}</span>
      </div>
    </div>
  );
}

export default DashboardCard;

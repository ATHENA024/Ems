import React from 'react';
import { formatCurrency } from '../../utils/helper';
import './DashboardStats.css';

function DashboardStats() {
  return (
    <div className="dashboard-stats">
      <div className="grid">
        <div className="dashboard-card card">
          <div className="dashboard-card-icon" style={{ background: '#eef2ff', color: '#6366f1' }}>👥</div>
          <div className="dashboard-card-content">
            <span className="dashboard-card-title">Total Employees</span>
            <span className="dashboard-card-value">156</span>
            <span className="dashboard-card-change positive">+12% from last month</span>
          </div>
        </div>
        <div className="dashboard-card card">
          <div className="dashboard-card-icon" style={{ background: '#e6f4ea', color: '#0f9d58' }}>✅</div>
          <div className="dashboard-card-content">
            <span className="dashboard-card-title">Present Today</span>
            <span className="dashboard-card-value">142</span>
            <span className="dashboard-card-change positive">91% attendance rate</span>
          </div>
        </div>
        <div className="dashboard-card card">
          <div className="dashboard-card-icon" style={{ background: '#fef7e0', color: '#f4b400' }}>⏳</div>
          <div className="dashboard-card-content">
            <span className="dashboard-card-title">On Leave</span>
            <span className="dashboard-card-value">8</span>
            <span className="dashboard-card-change">Pending requests: 3</span>
          </div>
        </div>
        <div className="dashboard-card card">
          <div className="dashboard-card-icon" style={{ background: '#fce8e6', color: '#d93025' }}>💰</div>
          <div className="dashboard-card-content">
            <span className="dashboard-card-title">Payroll (This Month)</span>
            <span className="dashboard-card-value">{formatCurrency(21000000)}</span>
            <span className="dashboard-card-change">Processed: 75%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;

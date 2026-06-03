import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Helpdesk.css';

const categories = ['Technical', 'HR', 'Payroll', 'Facilities', 'IT Access', 'Other'];

const initialTickets = [
  { id: 1, title: 'VPN not connecting', category: 'IT Access', empName: 'Rahul Sharma', priority: 'High', status: 'Open', date: '2026-05-20', desc: 'Unable to connect to office VPN from home network.' },
  { id: 2, title: 'Salary slip not visible', category: 'Payroll', empName: 'Priya Verma', priority: 'Medium', status: 'In Progress', date: '2026-05-19', desc: 'Cannot download June salary slip from the portal.' },
  { id: 3, title: 'AC not working', category: 'Facilities', empName: 'Amit Singh', priority: 'Low', status: 'Open', date: '2026-05-18', desc: 'The AC in cabin 4B is not cooling properly.' },
  { id: 4, title: 'New joiner laptop setup', category: 'IT Access', empName: 'Sneha Patel', priority: 'High', status: 'Resolved', date: '2026-05-16', desc: 'Need laptop configured for new team member joining Monday.' },
];

function Helpdesk() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState(initialTickets);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Technical', priority: 'Medium', desc: '' });
  const [filter, setFilter] = useState('all');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.desc) return;
    const ticket = { id: Date.now(), title: form.title, category: form.category, priority: form.priority, empName: 'Admin', status: 'Open', date: new Date().toISOString().split('T')[0], desc: form.desc };
    setTickets([ticket, ...tickets]);
    setForm({ title: '', category: 'Technical', priority: 'Medium', desc: '' });
    setShowForm(false);
  };

  const updateStatus = (id, status) => {
    setTickets(tickets.map((t) => t.id === id ? { ...t, status } : t));
  };

  const filtered = filter === 'all' ? tickets : tickets.filter((t) => t.status.replace(' ', '').toLowerCase() === filter);

  const statusColors = { Open: '#dc2626', 'In Progress': '#f59e0b', Resolved: '#0f9d58' };
  const priorityColors = { High: '#dc2626', Medium: '#f59e0b', Low: '#0f9d58' };

  return (
    <div className="hd-page">
      <div className="page-header">
        <h1>Helpdesk</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ New Ticket</button>
      </div>

      <div className="hd-summary">
        <div className="card hd-summary-card"><div className="hd-summary-val" style={{ color: '#6366f1' }}>{tickets.length}</div><div className="hd-summary-lbl">Total</div></div>
        <div className="card hd-summary-card"><div className="hd-summary-val" style={{ color: '#dc2626' }}>{tickets.filter((t) => t.status === 'Open').length}</div><div className="hd-summary-lbl">Open</div></div>
        <div className="card hd-summary-card"><div className="hd-summary-val" style={{ color: '#f59e0b' }}>{tickets.filter((t) => t.status === 'In Progress').length}</div><div className="hd-summary-lbl">In Progress</div></div>
        <div className="card hd-summary-card"><div className="hd-summary-val" style={{ color: '#0f9d58' }}>{tickets.filter((t) => t.status === 'Resolved').length}</div><div className="hd-summary-lbl">Resolved</div></div>
      </div>

      <div className="hd-tabs">
        <button className={`hd-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        <button className={`hd-tab ${filter === 'open' ? 'active' : ''}`} onClick={() => setFilter('open')}>Open</button>
        <button className={`hd-tab ${filter === 'inprogress' ? 'active' : ''}`} onClick={() => setFilter('inprogress')}>In Progress</button>
        <button className={`hd-tab ${filter === 'resolved' ? 'active' : ''}`} onClick={() => setFilter('resolved')}>Resolved</button>
      </div>

      <div className="hd-list">
        {filtered.map((t) => (
          <div key={t.id} className="card hd-ticket">
            <div className="hd-ticket-top">
              <div className="hd-ticket-left">
                <h3 className="hd-ticket-title">{t.title}</h3>
                <div className="hd-ticket-meta">
                  <span className="hd-ticket-cat">{t.category}</span>
                  <span>•</span>
                  <span>{t.empName}</span>
                  <span>•</span>
                  <span>{new Date(t.date).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="hd-priority" style={{ background: `${priorityColors[t.priority]}15`, color: priorityColors[t.priority] }}>{t.priority}</span>
                <span className="badge" style={{ background: `${statusColors[t.status]}15`, color: statusColors[t.status] }}>{t.status}</span>
              </div>
            </div>
            <p className="hd-ticket-desc">{t.desc}</p>
            <div className="hd-ticket-actions">
              {user?.role === 'admin' && t.status === 'Open' && <button className="btn btn-primary" style={{ padding: '5px 14px', fontSize: 12 }} onClick={() => updateStatus(t.id, 'In Progress')}>Start</button>}
              {user?.role === 'admin' && t.status === 'In Progress' && <button className="btn btn-success" style={{ padding: '5px 14px', fontSize: 12 }} onClick={() => updateStatus(t.id, 'Resolved')}>Resolve</button>}
              {user?.role === 'admin' && (t.status === 'Open' || t.status === 'In Progress') && <button className="btn btn-danger" style={{ padding: '5px 14px', fontSize: 12 }} onClick={() => updateStatus(t.id, 'Resolved')}>Close</button>}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <h2>Create Ticket</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Priority</label>
                  <select value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}>
                    <option>High</option><option>Medium</option><option>Low</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={form.desc} onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Helpdesk;

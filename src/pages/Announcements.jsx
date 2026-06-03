import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Announcements.css';

const initialPosts = [
  { id: 1, title: 'Holiday Schedule for June 2026', content: 'The office will remain closed on June 15th (Monday) for the regional festival. Please plan your work accordingly.', author: 'Admin', dept: 'HR', date: '2026-05-20', priority: 'High', comments: 5 },
  { id: 2, title: 'New Insurance Policy Updates', content: 'We have partnered with a new health insurance provider offering better coverage. Open enrollment starts next week.', author: 'Sneha Patel', dept: 'HR', date: '2026-05-18', priority: 'Medium', comments: 3 },
  { id: 3, title: 'Q2 Townhall Meeting', content: 'Quarterly townhall will be held on June 10th at 3 PM in the main conference room. All employees must attend.', author: 'Priya Verma', dept: 'Management', date: '2026-05-15', priority: 'High', comments: 8 },
  { id: 4, title: 'Office Renovation Notice', content: 'The 3rd floor cafeteria will be under renovation from June 1st-10th. Alternative dining arrangements have been made on the ground floor.', author: 'Admin', dept: 'Admin', date: '2026-05-12', priority: 'Low', comments: 2 },
];

function Announcements() {
  const { user } = useAuth();
  const [posts, setPosts] = useState(initialPosts);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', priority: 'Medium', dept: 'All' });
  const [filter, setFilter] = useState('all');

  const handlePost = (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return;
    const post = { id: Date.now(), title: form.title, content: form.content, author: 'Admin', dept: form.dept, date: new Date().toISOString().split('T')[0], priority: form.priority, comments: 0 };
    setPosts([post, ...posts]);
    setForm({ title: '', content: '', priority: 'Medium', dept: 'All' });
    setShowForm(false);
  };

  const filteredPosts = filter === 'all' ? posts : posts.filter((p) => p.priority.toLowerCase() === filter);

  const priorityColors = { High: '#dc2626', Medium: '#f59e0b', Low: '#0f9d58' };

  return (
    <div className="ann-page">
      <div className="page-header">
        <h1>Announcements</h1>
        {user?.role === 'admin' && <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ New Post</button>}
      </div>

      <div className="ann-filter">
        <button className={`ann-filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All ({posts.length})</button>
        <button className={`ann-filter-btn ${filter === 'high' ? 'active' : ''}`} onClick={() => setFilter('high')}>🔴 High</button>
        <button className={`ann-filter-btn ${filter === 'medium' ? 'active' : ''}`} onClick={() => setFilter('medium')}>🟡 Medium</button>
        <button className={`ann-filter-btn ${filter === 'low' ? 'active' : ''}`} onClick={() => setFilter('low')}>🟢 Low</button>
      </div>

      <div className="ann-list">
        {filteredPosts.map((p) => (
          <div key={p.id} className="card ann-card" style={{ borderLeft: `3px solid ${priorityColors[p.priority]}` }}>
            <div className="ann-card-top">
              <div>
                <h3 className="ann-title">{p.title}</h3>
                <div className="ann-meta">
                  <span>By {p.author}</span>
                  <span>•</span>
                  <span>{p.dept}</span>
                  <span>•</span>
                  <span>{new Date(p.date).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
              <span className="ann-priority" style={{ background: `${priorityColors[p.priority]}15`, color: priorityColors[p.priority] }}>{p.priority}</span>
            </div>
            <p className="ann-content">{p.content}</p>
            <div className="ann-card-bottom">
              <span className="ann-comments">💬 {p.comments} comments</span>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <h2>New Announcement</h2>
            <form onSubmit={handlePost}>
              <div className="form-group">
                <label>Title</label>
                <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea rows="4" value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} required />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Priority</label>
                  <select value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}>
                    <option>High</option><option>Medium</option><option>Low</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Department</label>
                  <select value={form.dept} onChange={(e) => setForm((p) => ({ ...p, dept: e.target.value }))}>
                    <option>All</option><option>Engineering</option><option>Marketing</option><option>HR</option><option>Finance</option><option>Sales</option><option>Admin</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Announcements;

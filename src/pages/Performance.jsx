import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Performance.css';

const employees = [
  { id: 1, name: 'Rahul Sharma', department: 'Engineering', avatar: 'Rahul+Sharma' },
  { id: 2, name: 'Priya Verma', department: 'Marketing', avatar: 'Priya+Verma' },
  { id: 3, name: 'Amit Singh', department: 'Engineering', avatar: 'Amit+Singh' },
  { id: 4, name: 'Sneha Patel', department: 'HR', avatar: 'Sneha+Patel' },
  { id: 5, name: 'Arjun Nair', department: 'Engineering', avatar: 'Arjun+Nair' },
  { id: 7, name: 'Divya Joshi', department: 'Sales', avatar: 'Divya+Joshi' },
  { id: 9, name: 'Karan Mehta', department: 'Engineering', avatar: 'Karan+Mehta' },
  { id: 11, name: 'Rohit Desai', department: 'Finance', avatar: 'Rohit+Desai' },
];

function Performance() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('perfTasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ empId: '', title: '', desc: '', priority: 'Medium', dueDate: '' });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.empId || !form.title || !form.dueDate) return;
    const emp = employees.find((e) => e.id === parseInt(form.empId));
    const task = {
      id: Date.now(),
      empId: parseInt(form.empId),
      empName: emp.name,
      empDept: emp.department,
      title: form.title,
      desc: form.desc,
      priority: form.priority,
      dueDate: form.dueDate,
      status: 'Assigned',
      assignedDate: new Date().toLocaleDateString('en-IN'),
    };
    const updated = [...tasks, task];
    setTasks(updated);
    localStorage.setItem('perfTasks', JSON.stringify(updated));
    setForm({ empId: '', title: '', desc: '', priority: 'Medium', dueDate: '' });
    setShowForm(false);
  };

  const handleStatus = (id, status) => {
    const updated = tasks.map((t) => t.id === id ? { ...t, status } : t);
    setTasks(updated);
    localStorage.setItem('perfTasks', JSON.stringify(updated));
  };

  const pending = tasks.filter((t) => t.status === 'Assigned' || t.status === 'In Progress').length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const highPriority = tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed').length;

  const priorityColors = { High: '#dc2626', Medium: '#f59e0b', Low: '#0f9d58' };

  return (
    <div className="perf-page">
      <div className="page-header">
        <h1>Performance Tasks</h1>
        {user?.role === 'admin' && <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ New Task</button>}
      </div>

      <div className="perf-summary">
        <div className="card perf-summary-card"><div className="perf-summary-val" style={{ color: '#6366f1' }}>{tasks.length}</div><div className="perf-summary-lbl">Total Tasks</div></div>
        <div className="card perf-summary-card"><div className="perf-summary-val" style={{ color: '#f59e0b' }}>{pending}</div><div className="perf-summary-lbl">Pending</div></div>
        <div className="card perf-summary-card"><div className="perf-summary-val" style={{ color: '#0f9d58' }}>{completed}</div><div className="perf-summary-lbl">Completed</div></div>
        <div className="card perf-summary-card"><div className="perf-summary-val" style={{ color: '#dc2626' }}>{highPriority}</div><div className="perf-summary-lbl">High Priority</div></div>
      </div>

      <div className="card">
        <h3 className="perf-section-title">Task List</h3>
        {tasks.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: 32 }}>No tasks assigned yet. Click "+ New Task" to assign one.</p>
        ) : (
          <div className="perf-task-list">
            {[...tasks].reverse().map((task) => (
              <div key={task.id} className={`perf-task-card ${task.status === 'Completed' ? 'done' : ''}`}>
                <div className="perf-task-top">
                  <div className="perf-task-user">
                    <img src={`https://ui-avatars.com/api/?name=${task.empName.replace(' ', '+')}&background=6366f1&color=fff&size=28`} alt="" />
                    <div>
                      <div className="perf-task-emp">{task.empName}</div>
                      <div className="perf-task-dept">{task.empDept}</div>
                    </div>
                  </div>
                  <span className="perf-task-priority" style={{ background: `${priorityColors[task.priority]}15`, color: priorityColors[task.priority] }}>{task.priority}</span>
                </div>
                <div className="perf-task-title">{task.title}</div>
                {task.desc && <div className="perf-task-desc">{task.desc}</div>}
                <div className="perf-task-meta">
                  <span>Due: {task.dueDate}</span>
                  <span className={`badge badge-${task.status === 'Completed' ? 'success' : task.status === 'In Progress' ? 'warning' : 'danger'}`}>{task.status}</span>
                </div>
                <div className="perf-task-actions">
                  {task.status === 'Assigned' && <button className="btn btn-primary" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => handleStatus(task.id, 'In Progress')}>Start</button>}
                  {task.status === 'In Progress' && <button className="btn btn-success" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => handleStatus(task.id, 'Completed')}>Complete</button>}
                  {task.status === 'Assigned' && <button className="btn btn-danger" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => handleStatus(task.id, 'Cancelled')}>Cancel</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <h2>Assign Task</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Employee</label>
                <select value={form.empId} onChange={(e) => setForm((p) => ({ ...p, empId: e.target.value }))} required>
                  <option value="">Select Employee</option>
                  {employees.map((e) => <option key={e.id} value={e.id}>{e.name} — {e.department}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Task Title</label>
                <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={form.desc} onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Priority</label>
                  <select value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}>
                    <option>High</option><option>Medium</option><option>Low</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Due Date</label>
                  <input type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Assign Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Performance;

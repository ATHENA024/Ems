import React, { useState } from 'react';
import './LMS.css';

const courses = [
  { id: 1, title: 'React.js Fundamentals', category: 'Engineering', duration: '4 weeks', level: 'Beginner', enrolled: 24, rating: 4.7, progress: 80, icon: '⚛️', status: 'In Progress' },
  { id: 2, title: 'Leadership & Management', category: 'Management', duration: '6 weeks', level: 'Advanced', enrolled: 18, rating: 4.5, progress: 30, icon: '👔', status: 'In Progress' },
  { id: 3, title: 'Data Analytics with Python', category: 'Data Science', duration: '8 weeks', level: 'Intermediate', enrolled: 15, rating: 4.8, progress: 100, icon: '📊', status: 'Completed' },
  { id: 4, title: 'Effective Communication', category: 'Soft Skills', duration: '3 weeks', level: 'Beginner', enrolled: 32, rating: 4.3, progress: 0, icon: '💬', status: 'Not Started' },
  { id: 5, title: 'Cloud Computing (AWS)', category: 'Engineering', duration: '6 weeks', level: 'Advanced', enrolled: 12, rating: 4.9, progress: 60, icon: '☁️', status: 'In Progress' },
  { id: 6, title: 'Cybersecurity Essentials', category: 'Security', duration: '5 weeks', level: 'Intermediate', enrolled: 20, rating: 4.6, progress: 0, icon: '🔒', status: 'Not Started' },
  { id: 7, title: 'Digital Marketing 101', category: 'Marketing', duration: '4 weeks', level: 'Beginner', enrolled: 28, rating: 4.4, progress: 100, icon: '📱', status: 'Completed' },
  { id: 8, title: 'Financial Planning & Analysis', category: 'Finance', duration: '5 weeks', level: 'Intermediate', enrolled: 10, rating: 4.2, progress: 10, icon: '💰', status: 'In Progress' },
];

const categories = ['All', 'Engineering', 'Management', 'Data Science', 'Soft Skills', 'Security', 'Marketing', 'Finance'];

function LMS() {
  const [cat, setCat] = useState('All');
  const [enrolled, setEnrolled] = useState(() => {
    const saved = localStorage.getItem('lmsEnrolled');
    return saved ? JSON.parse(saved) : [1, 3, 5, 8];
  });

  const filtered = cat === 'All' ? courses : courses.filter((c) => c.category === cat);

  const toggleEnroll = (id) => {
    const updated = enrolled.includes(id) ? enrolled.filter((e) => e !== id) : [...enrolled, id];
    setEnrolled(updated);
    localStorage.setItem('lmsEnrolled', JSON.stringify(updated));
  };

  const inProgress = courses.filter((c) => enrolled.includes(c.id) && c.progress > 0 && c.progress < 100).length;
  const completed = courses.filter((c) => c.progress === 100).length;

  return (
    <div className="lms-page">
      <div className="page-header">
        <h1>Learning Management System</h1>
        <span style={{ color: '#64748b', fontSize: 14 }}>{enrolled.length} enrolled</span>
      </div>

      <div className="lms-summary">
        <div className="card lms-summary-card"><div className="lms-summary-val" style={{ color: '#6366f1' }}>{courses.length}</div><div className="lms-summary-lbl">Total Courses</div></div>
        <div className="card lms-summary-card"><div className="lms-summary-val" style={{ color: '#0f9d58' }}>{completed}</div><div className="lms-summary-lbl">Completed</div></div>
        <div className="card lms-summary-card"><div className="lms-summary-val" style={{ color: '#f59e0b' }}>{inProgress}</div><div className="lms-summary-lbl">In Progress</div></div>
        <div className="card lms-summary-card"><div className="lms-summary-val" style={{ color: '#0f9d58' }}>{Math.round(courses.reduce((s, c) => s + c.rating, 0) / courses.length * 10) / 10}</div><div className="lms-summary-lbl">Avg Rating</div></div>
      </div>

      <div className="lms-categories">
        {categories.map((c) => (
          <button key={c} className={`lms-cat ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      <div className="lms-grid">
        {filtered.map((course) => {
          const isEnrolled = enrolled.includes(course.id);
          return (
            <div key={course.id} className="card lms-course-card">
              <div className="lms-course-icon">{course.icon}</div>
              <div className="lms-course-top">
                <h3 className="lms-course-title">{course.title}</h3>
                <span className="lms-course-level" style={{ background: course.level === 'Beginner' ? '#e6f4ea' : course.level === 'Intermediate' ? '#fef7e0' : '#fce8e6', color: course.level === 'Beginner' ? '#0f9d58' : course.level === 'Intermediate' ? '#f59e0b' : '#dc2626' }}>{course.level}</span>
              </div>
              <div className="lms-course-meta">
                <span>{course.duration}</span>
                <span>{course.category}</span>
              </div>
              <div className="lms-course-stats">
                <span>👥 {course.enrolled}</span>
                <span>⭐ {course.rating}</span>
              </div>
              {isEnrolled && (
                <div className="lms-progress">
                  <div className="lms-progress-bar-bg">
                    <div className="lms-progress-bar" style={{ width: `${course.progress}%`, background: course.progress === 100 ? '#0f9d58' : '#6366f1' }}></div>
                  </div>
                  <span className="lms-progress-text">{course.progress}%</span>
                </div>
              )}
              <button className={`btn ${isEnrolled ? 'btn-secondary' : 'btn-primary'}`} style={{ width: '100%', marginTop: 12 }} onClick={() => toggleEnroll(course.id)}>
                {isEnrolled ? 'Enrolled' : 'Enroll Now'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LMS;

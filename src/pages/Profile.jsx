import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmployeeContext } from '../context/EmployeeContext';
import { getProfilePhoto, saveProfilePhoto } from '../utils/helper';
import api from '../services/api';

function Profile() {
  const { user } = useAuth();
  const { employees } = useEmployeeContext();
  const fileRef = useRef(null);
  const emp = employees.find((e) => `${e.firstName} ${e.lastName}` === user?.name);
  const profile = emp || { firstName: 'Admin', lastName: 'User', email: user?.email || 'admin@ems.com', position: 'Administrator' };

  const [photo, setPhoto] = useState(() => getProfilePhoto(user?.email));

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      saveProfilePhoto(user?.email, dataUrl);
      setPhoto(dataUrl);
      try { await api.put('/auth/profile', { avatar: dataUrl }); } catch {}
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = async () => {
    saveProfilePhoto(user?.email, null);
    setPhoto(null);
    try { await api.put('/auth/profile', { avatar: '' }); } catch {}
  };

  return (
    <div>
      <div className="page-header">
        <h1>Profile</h1>
      </div>
      <div className="card" style={{ maxWidth: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28 }}>
          <div className="profile-photo-section" style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={photo || `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=6366f1&color=fff&size=96`}
              alt="Profile"
              style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0' }}
            />
            <div style={{ marginTop: 10, display: 'flex', gap: 6, justifyContent: 'center' }}>
              <button className="btn btn-primary" style={{ padding: '5px 14px', fontSize: 12 }} onClick={() => fileRef.current?.click()}>
                Change Photo
              </button>
              {photo && (
                <button className="btn btn-danger" style={{ padding: '5px 14px', fontSize: 12 }} onClick={handleRemove}>
                  Remove
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
          </div>
          <div>
            <h2 style={{ marginBottom: 4 }}>{profile.firstName} {profile.lastName}</h2>
            <p style={{ color: '#64748b', marginBottom: 2 }}>{profile.position}</p>
            {user?.employeeId && (
              <span style={{ display: 'inline-block', padding: '2px 10px', background: '#eef2ff', color: '#4f46e5', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>{user.employeeId}</span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
            <span style={{ color: '#64748b' }}>Email</span>
            <span>{profile.email}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
            <span style={{ color: '#64748b' }}>Department</span>
            <span>{profile.department || '—'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
            <span style={{ color: '#64748b' }}>Joined</span>
            <span>{profile.joinDate || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

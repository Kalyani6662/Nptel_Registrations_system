// Settings.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData')) || {};

  return (
    <div className="settings-container">
      <h1>Account Settings</h1>
      
      <div className="settings-section">
        <h2>Personal Information</h2>
        <div className="settings-item">
          <label>Name</label>
          <input type="text" defaultValue={userData.name || ''} />
        </div>
        <div className="settings-item">
          <label>Email</label>
          <input type="email" defaultValue={userData.email || ''} />
        </div>
        <button className="save-btn">Save Changes</button>
      </div>
      
      <div className="settings-section">
        <h2>Change Password</h2>
        <div className="settings-item">
          <label>Current Password</label>
          <input type="password" />
        </div>
        <div className="settings-item">
          <label>New Password</label>
          <input type="password" />
        </div>
        <div className="settings-item">
          <label>Confirm New Password</label>
          <input type="password" />
        </div>
        <button className="save-btn">Update Password</button>
      </div>
      
      <div className="settings-section danger-zone">
        <h2>Danger Zone</h2>
        <button 
          className="danger-btn"
          onClick={() => {
            if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
              localStorage.clear();
              navigate('/login');
            }
          }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;
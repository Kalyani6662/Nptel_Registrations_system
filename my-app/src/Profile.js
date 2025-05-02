// Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('userData'));
    if (!data) {
      navigate('/login');
    } else {
      setUserData(data);
    }
  }, [navigate]);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {userData.name && userData.name.charAt(0).toUpperCase()}
        </div>
        <h1>{userData.name || 'User Profile'}</h1>
      </div>
      
      <div className="profile-details">
        <div className="detail-item">
          <label>Name:</label>
          <p>{userData.name || 'Not available'}</p>
        </div>
        <div className="detail-item">
          <label>Email:</label>
          <p>{userData.email || 'Not available'}</p>
        </div>
        <div className="detail-item">
          <label>Role:</label>
          <p>{userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Not available'}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
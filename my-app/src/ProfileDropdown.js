import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiSettings as SettingsIcon,
  FiUser as UserIcon,
  FiLogOut as LogoutIcon,
  FiHelpCircle as HelpIcon
} from "react-icons/fi";

const ProfileDropdown = ({ user, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    navigate('/login');
    onClose();
  };

  return (
    <div className="profile-dropdown">
      <div className="dropdown-header">
        <div className="dropdown-avatar">
          {user.name && user.name.charAt(0).toUpperCase()}
        </div>
        <div className="dropdown-user-info">
          <h4>{user.name || "User"}</h4>
          <p>{user.email || "user@example.com"}</p>
        </div>
      </div>
      <div className="dropdown-divider"></div>
      <button 
        className="dropdown-item"
        onClick={() => {
          navigate('/profile');
          onClose();
        }}
      >
        <UserIcon className="dropdown-icon" /> Profile
      </button>
      <button 
        className="dropdown-item"
        onClick={() => {
          navigate('/settings');
          onClose();
        }}
      >
        <SettingsIcon className="dropdown-icon" /> Settings
      </button>
      <div className="dropdown-divider"></div>
      <button 
        className="dropdown-item"
        onClick={() => {
          navigate('/help');
          onClose();
        }}
      >
        <HelpIcon className="dropdown-icon" /> Help
      </button>
      <div className="dropdown-divider"></div>
      <button 
        className="dropdown-item logout-item"
        onClick={handleLogout}
      >
        <LogoutIcon className="dropdown-icon" /> Logout
      </button>
    </div>
  );
};

export default ProfileDropdown;
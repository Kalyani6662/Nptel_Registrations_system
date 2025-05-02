import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPanel() {
  const navigate = useNavigate();
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  const handleNavigation = (path, setLoading) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <svg className="logo" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
          <h1 className="title">NPTEL Learning Portal</h1>
        </div>
        
        <p className="subtitle">Select an option to continue</p>
        
        <div className="button-group">
          <button
            onClick={() => handleNavigation("/login", setLoadingLogin)}
            className={`login-button ${loadingLogin ? 'loading' : ''}`}
            disabled={loadingLogin}
          >
            {loadingLogin ? (
              <div className="spinner"></div>
            ) : (
              <>
                <svg className="icon" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
                Login
              </>
            )}
          </button>
          
          <button
            onClick={() => handleNavigation("/register", setLoadingRegister)}
            className={`register-button ${loadingRegister ? 'loading' : ''}`}
            disabled={loadingRegister}
          >
            {loadingRegister ? (
              <div className="spinner"></div>
            ) : (
              <>
                <svg className="icon" viewBox="0 0 24 24">
                  <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                Register
              </>
            )}
          </button>
        </div>
        
        
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: url('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBwbGUlMjBsYXB0b3B8ZW58MHx8MHx8fDA%3D') no-repeat center center;
          background-size: cover;
          position: relative;
          font-family: 'Roboto', sans-serif;
        }
        
        .login-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
        }
        
        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 48px 40px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          text-align: center;
          animation: fadeIn 0.4s ease-out;
          position: relative;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          z-index: 1;
        }
        
        .logo-container {
          margin-bottom: 24px;
        }
        
        .logo {
          width: 48px;
          height: 48px;
          fill: white;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }
        
        .title {
  font-size: 24px;
  font-weight: 500;
  margin: 2px 0 0;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  
  /* Add these properties to center the text */
  display: flex;
  justify-content: center; /* Horizontal centering */
  align-items: center;     /* Vertical centering */
  text-align: center;      /* Fallback for older browsers */
}
        
        .subtitle {
          font-size: 16px;
          color: rgba(255,255,255,0.9);
          margin-bottom: 40px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        
        .button-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .login-button, .register-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 14px 24px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          height: 48px;
          border: none;
          backdrop-filter: blur(4px);
        }
        
        .login-button {
          background: rgba(60, 4, 104, 0.9);
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .login-button:hover {
          background: rgba(5, 5, 5, 0.95);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }
        
        .register-button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .register-button:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-1px);
        }
        
        .icon {
          width: 20px;
          height: 20px;
          margin-right: 10px;
          fill: currentColor;
        }
        
        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }
        
        .footer {
          margin-top: 32px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          justify-content: center;
        }
        
        .language-selector {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 14px;
          color: white;
          backdrop-filter: blur(4px);
          cursor: pointer;
        }
        
        .language-selector option {
          background: rgba(0, 0, 0, 0.8);
          color: white;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 480px) {
          .login-card {
            padding: 40px 24px;
            margin: 16px;
            border-radius: 12px;
          }
          
          .title {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}

export default LoginPanel;
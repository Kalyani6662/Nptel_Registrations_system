import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    regNumber: '',
    email: '',
    role: 'student',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { name, regNumber, email, password } = formData;

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!regNumber.trim()) newErrors.regNumber = 'Registration number is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      setErrors({ success: response.data.message });
      setFormData({
        name: '',
        regNumber: '',
        email: '',
        role: 'student',
        password: '',
      });
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setErrors({ 
        server: error.response?.data?.message || 'Registration failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-container">
      <div className="image-side">
        <div className="image-content">
          <h1>NPTEL</h1>
          <h2>Student learning</h2>
        </div>
      </div>
      
      <div className="form-side">
        <div className="form-content">
          <div className="register-card">
            <div className="logo-container">
              <svg className="google-logo" viewBox="0 0 75 24" width="75" height="24">
                <path d="M67.954 16.303c-1.33 0-2.278-.608-2.886-1.804l7.967-3.3-.27-.68c-1.885-4.772-6.408-7.795-12.017-7.795-7.21 0-13.05 5.847-13.05 13.05 0 7.204 5.84 13.05 13.05 13.05 5.61 0 10.132-3.024 12.017-7.796l.27-.68-7.967-3.3c-.608 1.196-1.556 1.804-2.886 1.804zm-13.05-9.68c4.44 0 8.05 3.61 8.05 8.05 0 4.44-3.61 8.05-8.05 8.05-4.44 0-8.05-3.61-8.05-8.05 0-4.44 3.61-8.05 8.05-8.05z" fill="#4285F4"></path>
                <path d="M32.14 12.25c0-1.79.15-3.53.43-5.15H12.5v9.72h11.11c-.56 2.96-2.22 5.47-4.71 7.14l7.16 5.55c4.24-3.92 6.68-9.7 6.68-16.26z" fill="#34A853"></path>
                <path d="M19.9 23.72c-3.17 0-5.83-1.04-7.77-2.82l-7.16-5.55c-1.03 2.06-1.62 4.45-1.62 6.97 0 2.52.59 4.91 1.62 6.97l7.16-5.55c1.94 1.78 4.6 2.82 7.77 2.82z" fill="#FBBC05"></path>
                <path d="M19.9 4.28c3.17 0 5.83 1.04 7.77 2.82l7.16-5.55C34.5.76 30.64-.01 26.5 0 15.8 0 7.4 8.4 7.4 19.1c0 2.52.59 4.91 1.62 6.97l7.16-5.55c1.94-1.78 4.6-2.82 7.77-2.82z" fill="#EA4335"></path>
              </svg>
              <h1>Create your NPTEL Account</h1>
            </div>

            {errors.success && (
              <div className="success-message">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#34A853">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>{errors.success}</span>
              </div>
            )}

            {errors.server && (
              <div className="error-message">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#EA4335">
                  <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                </svg>
                <span>{errors.server}</span>
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder=" "
                  className={errors.name ? 'error' : ''}
                  required
                />
                <label>Full Name</label>
                {errors.name && <div className="input-error">{errors.name}</div>}
              </div>

              <div className="input-group">
                <input
                  type="text"
                  name="regNumber"
                  value={formData.regNumber}
                  onChange={handleChange}
                  placeholder=" "
                  className={errors.regNumber ? 'error' : ''}
                  required
                />
                <label>Registration Number</label>
                {errors.regNumber && <div className="input-error">{errors.regNumber}</div>}
              </div>

              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=" "
                  className={errors.email ? 'error' : ''}
                  required
                />
                <label>Email Address</label>
                {errors.email && <div className="input-error">{errors.email}</div>}
              </div>

              <div className="input-group">
                <select 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange}
                  required
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
                <label>Account Type</label>
              </div>

              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder=" "
                  className={errors.password ? 'error' : ''}
                  required
                />
                <label>Password</label>
                {errors.password && <div className="input-error">{errors.password}</div>}
              </div>

              <button type="submit" className="register-button" disabled={loading}>
                {loading ? (
                  <>
                    <svg className="spinner" viewBox="0 0 50 50">
                      <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="login-redirect">
              <span>Already have an account?</span>
              <a href="/login">Sign in</a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        :root {
          --primary: #4285F4;
          --success: #34A853;
          --warning: #FBBC05;
          --error: #EA4335;
          --text-primary: #202124;
          --text-secondary: #5F6368;
          --border: #DADCE0;
          --bg-gray: #F8F9FA;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Google Sans', Roboto, Arial, sans-serif;
        }

        body, html {
          height: 100%;
          overflow: hidden;
        }

        .register-page-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
        }

        .image-side {
          flex: 1;
          display: flex;
          background-color: #f0f2f5;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .image-content {
          text-align: center;
          color: var(--text-primary);
        }

        .image-content h1 {
          font-size: 36px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .image-content h2 {
          font-size: 24px;
          font-weight: 400;
          color: var(--text-secondary);
        }

        .form-side {
          flex: 1;
          display: flex;
          background-color: white;
          overflow-y: auto;
        }

        .form-content {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }

        .register-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 450px;
          padding: 40px;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .logo-container {
          text-align: center;
          margin-bottom: 24px;
        }

        .logo-container h1 {
          font-size: 24px;
          font-weight: 400;
          color: var(--text-primary);
          margin-top: 16px;
        }

        .google-logo {
          margin: 0 auto;
        }

        .success-message, .error-message {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 24px;
          font-size: 14px;
        }

        .success-message {
          background-color: rgba(52, 168, 83, 0.1);
          color: var(--success);
        }

        .error-message {
          background-color: rgba(234, 67, 53, 0.1);
          color: var(--error);
        }

        .success-message svg, .error-message svg {
          margin-right: 8px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-group {
          position: relative;
        }

        .input-group label {
          position: absolute;
          top: 18px;
          left: 12px;
          color: var(--text-secondary);
          pointer-events: none;
          transition: all 0.2s ease;
          background: white;
          padding: 0 4px;
          font-size: 16px;
        }

        .input-group input:focus + label,
        .input-group input:not(:placeholder-shown) + label,
        .input-group select:focus + label,
        .input-group select:not(:placeholder-shown) + label {
          top: -8px;
          left: 8px;
          font-size: 12px;
          color: var(--primary);
        }

        .input-group input, .input-group select {
          width: 100%;
          height: 56px;
          padding: 16px 14px;
          font-size: 16px;
          border: 1px solid var(--border);
          border-radius: 4px;
          outline: none;
          transition: border 0.2s ease;
          background-color: transparent;
        }

        .input-group input:focus, .input-group select:focus {
          border-color: var(--primary);
          border-width: 2px;
          padding: 15px 13px;
        }

        .input-group input.error, .input-group select.error {
          border-color: var(--error);
        }

        .input-error {
          color: var(--error);
          font-size: 12px;
          margin-top: 4px;
          padding-left: 12px;
        }

        .register-button {
          height: 48px;
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        }

        .register-button:hover {
          background-color: #3367D6;
        }

        .register-button:disabled {
          background-color: rgba(66, 133, 244, 0.6);
          cursor: not-allowed;
        }

        .spinner {
          animation: rotate 1.4s linear infinite;
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }

        .spinner circle {
          stroke: white;
          stroke-dasharray: 80px;
          stroke-dashoffset: 60px;
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .login-redirect {
          text-align: center;
          margin-top: 32px;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .login-redirect a {
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
          margin-left: 4px;
        }

        .login-redirect a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .register-page-container {
            flex-direction: column;
          }

          .image-side {
            display: none;
          }

          .form-side {
            width: 100%;
          }

          .form-content {
            padding: 40px 0;
          }

          .register-card {
            width: 95%;
            padding: 30px 20px;
            margin-top: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default RegisterPage;
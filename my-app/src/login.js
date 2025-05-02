import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
        role,
      });
      
      // Store user data in localStorage
      localStorage.setItem('authToken', response.data.token || 'dummy-token');
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('userData', JSON.stringify({
        name: response.data.user.name,
        email: response.data.user.email,
        regNumber: response.data.user.regNumber,
        role: response.data.user.role
      }));

// Redirect based on role
if (role === "student") {
  navigate("/student-dashboard");
} else {
  navigate("/admin-dashboard");
}
} catch (error) {
alert(error.response?.data?.message || "❌ Login failed.");
} finally {
setIsLoading(false);
}
};

return (
<div className="login-page">
<div className="login-container">
  <div className="avatar">
    <img
      src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
      alt="User Avatar"
    />
  </div>
        <h2>Login Form</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <div className="input-group role-select">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>
        <p className="forgot-password">
          <a href="/forgot-password">Forgot Password?</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
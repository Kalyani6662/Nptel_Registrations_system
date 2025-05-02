import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import axios from "axios";
import CountUp from "react-countup";

const StudentDashboard = () => {
  const [certificatesCount, setCertificatesCount] = useState(0);
  const [videosCount, setVideosCount] = useState(0);
  const [assignmentsCount, setAssignmentsCount] = useState(0);
  const [announcementsCount, setAnnouncementsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("Student");
  const navigate = useNavigate();

  // Fetch all counts and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch user data from localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData && userData.name) {
          setUserName(userData.name);
        }

        const [
          certificatesRes, 
          videosRes, 
          assignmentsRes,
          announcementsRes
        ] = await Promise.all([
          axios.get("http://localhost:5000/certificates"),
          axios.get("http://localhost:5000/videos"),
          axios.get("http://localhost:5000/assignments"),
          axios.get("http://localhost:5000/announcements")
        ]);

        setCertificatesCount(certificatesRes.data.length || 0);
        setVideosCount(videosRes.data.length || 0);
        setAssignmentsCount(assignmentsRes.data.length || 0);
        setAnnouncementsCount(announcementsRes.data.length || 0);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data");
        
        // Set default counts if API fails
        setCertificatesCount(0);
        setVideosCount(0);
        setAssignmentsCount(0);
        setAnnouncementsCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    
    // Redirect to login panel
    navigate('/login-panel');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="user-profile">
          <div className="avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="user-info">
            <h3>{userName}</h3>
            <p>Student</p>
          </div>
        </div>
        
        <h2 className="dashboard-title">Student Dashboard</h2>
        <ul className="nav-menu">
          <li>
            <Link to="/">
              <i className="fas fa-home"></i> Home
            </Link>
          </li>
          <li>
            <Link to="/your-courses">
              <i className="fas fa-book"></i> Courses
            </Link>
          </li>
          <li>
            <Link to="/student-certificates">
              <i className="fas fa-certificate"></i> Certificates
            </Link>
          </li>
<li>
  <Link to="/student-videos">
    <i className="fas fa-video"></i> Your Videos
  </Link>
</li>
<li>
  <Link to="/student-assignments">
    <i className="fas fa-tasks"></i> Your Assignments
  </Link>
</li>
          <li>
            <Link to="/student-announcements">
              <i className="fas fa-bullhorn"></i> Announcements
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <h1>VFSTR Learning Portal</h1>
          <div className="header-actions">
            <div className="notification-bell">
              <i className="fas fa-bell"></i>
              <span className="notification-count">3</span>
            </div>
            <div className="user-greeting">
              Welcome back, <strong>{userName}</strong>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon certificate-icon">
                <i className="fas fa-certificate"></i>
              </div>
              <div className="stat-content">
                <h3>Certificates</h3>
                <div className="count-animation">
                  {isLoading ? (
                    <div className="skeleton-loader"></div>
                  ) : error ? (
                    <span className="error-text">Error</span>
                  ) : (
                    <>
                      <CountUp 
                        end={certificatesCount} 
                        duration={2.5} 
                        className="count-number"
                      />
                      <span className="count-plus">+</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon video-icon">
                <i className="fas fa-film"></i>
              </div>
              <div className="stat-content">
                <h3>Videos</h3>
                <div className="count-animation">
                  {isLoading ? (
                    <div className="skeleton-loader"></div>
                  ) : error ? (
                    <span className="error-text">Error</span>
                  ) : (
                    <>
                      <CountUp 
                        end={videosCount} 
                        duration={2.5} 
                        className="count-number"
                      />
                      <span className="count-plus">+</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon assignment-icon">
                <i className="fas fa-clipboard-check"></i>
              </div>
              <div className="stat-content">
                <h3>Assignments</h3>
                <div className="count-animation">
                  {isLoading ? (
                    <div className="skeleton-loader"></div>
                  ) : error ? (
                    <span className="error-text">Error</span>
                  ) : (
                    <>
                      <CountUp 
                        end={assignmentsCount} 
                        duration={2.5} 
                        className="count-number"
                      />
                      <span className="count-plus">+</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon announcement-icon">
                <i className="fas fa-bullhorn"></i>
              </div>
              <div className="stat-content">
                <h3>Announcements</h3>
                <div className="count-animation">
                  {isLoading ? (
                    <div className="skeleton-loader"></div>
                  ) : error ? (
                    <span className="error-text">Error</span>
                  ) : (
                    <>
                      <CountUp 
                        end={announcementsCount} 
                        duration={2.5} 
                        className="count-number"
                      />
                      <span className="count-plus">+</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons - Centered */}
        <section className="action-buttons-section">
          <div className="buttons-container">
            <button 
              onClick={() => navigate('/courses')} 
              className="action-btn primary-btn"
            >
              <i className="fas fa-book"></i> Browse Courses
            </button>
            <button 
              onClick={() => navigate('/assignments')} 
              className="action-btn outline-btn"
            >
              <i className="fas fa-tasks"></i> View Assignments
            </button>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="recent-activity">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <Link to="/activity" className="view-all">View All</Link>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Course</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Submitted Assignment</td>
                  <td>Mathematics</td>
                  <td>10:30 AM</td>
                  <td><span className="status-badge success">Completed</span></td>
                </tr>
                <tr>
                  <td>Watched Video</td>
                  <td>Science</td>
                  <td>09:45 AM</td>
                  <td><span className="status-badge success">Completed</span></td>
                </tr>
                <tr>
                  <td>Downloaded Certificate</td>
                  <td>History</td>
                  <td>Yesterday</td>
                  <td><span className="status-badge pending">Pending</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
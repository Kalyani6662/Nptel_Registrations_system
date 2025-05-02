import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import axios from "axios";
import CountUp from "react-countup";

const AdminDashboard = () => {
  const [certificatesCount, setCertificatesCount] = useState(0);
  const [videosCount, setVideosCount] = useState(0);
  const [assignmentsCount, setAssignmentsCount] = useState(0);
  const [announcementsCount, setAnnouncementsCount] = useState(0);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("Admin");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    type: "assignment",
    title: "",
    description: "",
    courseName: "",
    certificateUrl: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData && userData.name) {
          setUserName(userData.name);
        }

        const [studentsRes, certificatesRes, videosRes, assignmentsRes, announcementsRes] = 
          await Promise.all([
            axios.get("http://localhost:5000/students"),
            axios.get("http://localhost:5000/certificates"),
            axios.get("http://localhost:5000/videos"),
            axios.get("http://localhost:5000/assignments"),
            axios.get("http://localhost:5000/announcements")
          ]);

        setStudents(studentsRes.data);
        setCertificatesCount(certificatesRes.data.length);
        setVideosCount(videosRes.data.length);
        setAssignmentsCount(assignmentsRes.data.length);
        setAnnouncementsCount(announcementsRes.data.length);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data");
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    navigate('/login-panel');
  };

  const handleAddData = async (e) => {
    e.preventDefault();
    try {
      if (!formData.studentId) {
        alert("Please select a student");
        return;
      }
  
      const student = students.find(s => s._id === formData.studentId);
      if (!student) {
        alert("Student not found");
        return;
      }
  
      const dataToSend = {
        studentId: formData.studentId,
        studentName: student.name,
        regNumber: student.regNumber,
        email: student.email,
        courseName: formData.courseName,
        [formData.type === 'certificate' ? 'certificateTitle' : 
         formData.type === 'video' ? 'videoName' : 'assignmentName']: formData.title,
        description: formData.description,
        ...(formData.type === 'certificate' ? { certificateUrl: formData.certificateUrl } : {})
      };
  
      let endpoint = "";
      switch(formData.type) {
        case "assignment":
          endpoint = "assignments";
          break;
        case "certificate":
          endpoint = "certificates";
          break;
        case "video":
          endpoint = "videos";
          break;
        default:
          endpoint = "assignments";
      }
  
      // Add the data (fixed - removed unused response variable)
      await axios.post(`http://localhost:5000/${endpoint}`, dataToSend);
      
      alert(`${formData.type} added successfully for ${student.name}!`);
      setShowAddForm(false);
      setFormData({
        studentId: "",
        type: "assignment",
        title: "",
        description: "",
        courseName: "",
        certificateUrl: ""
      });
      
      // Refresh counts
      const counts = await Promise.all([
        axios.get("http://localhost:5000/certificates"),
        axios.get("http://localhost:5000/videos"),
        axios.get("http://localhost:5000/assignments")
      ]);
      
      setCertificatesCount(counts[0].data.length);
      setVideosCount(counts[1].data.length);
      setAssignmentsCount(counts[2].data.length);
      
    } catch (err) {
      console.error("Error adding data:", err);
      alert("Failed to add data");
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="user-profile">
          <div className="avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="user-info">
            <h3>{userName}</h3>
            <p>Administrator</p>
          </div>
        </div>
        
        <h2 className="dashboard-title">Admin Dashboard</h2>
        <ul className="nav-menu">
          <li>
            <Link to="/">
              <i className="fas fa-home"></i> Home
            </Link>
          </li>
          <li>
            <Link to="/courses">
              <i className="fas fa-book"></i> Courses
            </Link>
          </li>
          <li>
            <Link to="/certificates">
              <i className="fas fa-certificate"></i> Certificates
            </Link>
          </li>
          <li>
            <Link to="/videos">
              <i className="fas fa-video"></i> Videos
            </Link>
          </li>
          <li>
            <Link to="/assignments">
              <i className="fas fa-tasks"></i> Assignments
            </Link>
          </li>
          <li>
            <Link to="/announcements">
              <i className="fas fa-bullhorn"></i> Announcements
            </Link>
          </li>
          <li>
            <button onClick={() => setShowAddForm(!showAddForm)} className="add-btn">
              <i className="fas fa-plus"></i> Add Data
            </button>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </li>
        </ul>
      </aside>

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

        {showAddForm && (
          <div className="add-data-modal">
            <div className="add-data-form">
              <h3>Add New Data</h3>
              <button className="close-btn" onClick={() => setShowAddForm(false)}>
                <i className="fas fa-times"></i>
              </button>
              <form onSubmit={handleAddData}>
                <div className="form-group">
                  <label>Student:</label>
                  <select 
                    value={formData.studentId}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} ({student.regNumber})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Type:</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="assignment">Assignment</option>
                    <option value="certificate">Certificate</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Course:</label>
                  <input
                    type="text"
                    value={formData.courseName}
                    onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                {formData.type === 'certificate' && (
                  <div className="form-group">
                    <label>Certificate URL:</label>
                    <input
                      type="text"
                      value={formData.certificateUrl}
                      onChange={(e) => setFormData({...formData, certificateUrl: e.target.value})}
                      required={formData.type === 'certificate'}
                    />
                  </div>
                )}

                <button type="submit" className="submit-btn">Add Data</button>
              </form>
            </div>
          </div>
        )}

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

        <section className="action-buttons-section">
          <div className="buttons-container">
            <button 
              onClick={() => navigate('/courses')} 
              className="action-btn primary-btn"
            >
              <i className="fas fa-book"></i> Browse Courses
            </button>
            <button 
              onClick={() => setShowAddForm(true)} 
              className="action-btn outline-btn"
            >
              <i className="fas fa-plus"></i> Add New Data
            </button>
          </div>
        </section>

        <section className="recent-activity">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <Link to="/activity" className="view-all">View All</Link>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Course</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">JD</div>
                      <span>John Doe</span>
                    </div>
                  </td>
                  <td>Submitted Assignment</td>
                  <td>Mathematics</td>
                  <td>10:30 AM</td>
                  <td><span className="status-badge success">Completed</span></td>
                </tr>
                <tr>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">JS</div>
                      <span>Jane Smith</span>
                    </div>
                  </td>
                  <td>Watched Video</td>
                  <td>Science</td>
                  <td>09:45 AM</td>
                  <td><span className="status-badge success">Completed</span></td>
                </tr>
                <tr>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">RJ</div>
                      <span>Robert Johnson</span>
                    </div>
                  </td>
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

export default AdminDashboard;
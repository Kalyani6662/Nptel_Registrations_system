import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import HomePage from "./Homepage";
import LoginPanel from "./LoginPanel";
import LoginPage from "./login";
import RegisterPage from "./Registerpage";
import CoursesPage from "./courses";
import CourseDetailsPage from "./Coursedetails";
import StudentDashboard from "./StudentDashboard"; 
import AdminDashboard from "./AdminDashboard"; // Import Admin Dashboard
import CertificatesPage from "./CertificatesPage";
import VideosPage from "./VideosPage";
import AssignmentsPage from "./AssignmentsPage";
import Announcements from "./AnnouncementsPage";
import Profile from './Profile';
import Settings from './Settings';
import Help from './Help';
import "./App.css";
import ProfileDropdown from "./ProfileDropdown";
import StudentCertificatesPage from './StudentCertificatesPage';
import StudentVideos from "./StudentVideos";
import StudentAssignments from "./StudentAssignments";
import StudentAnnouncements from "./StudentAnnouncements";
import YourCoursesPage from './YourCoursesPage';
import RegisterationForm from "./RegisterationForm";




function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-logo">NPTEL</div>
          <div className="navbar-links">
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")} end>
              Home
            </NavLink>
            <NavLink to="/login-panel" className={({ isActive }) => (isActive ? "active" : "")}>
              Login Panel
            </NavLink>
            <NavLink to="/courses" className={({ isActive }) => (isActive ? "active" : "")}>
              Courses
            </NavLink>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login-panel" element={<LoginPanel />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/course/:id" element={<CourseDetailsPage />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} /> 
          <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        <Route path="/ProfileDropdown" element={<ProfileDropdown/>}/>
        <Route path="/student-certificates" element={<StudentCertificatesPage />} />
        <Route path="/student-videos" element={<StudentVideos />} />
        <Route path="/student-assignments" element={<StudentAssignments />} />
        <Route path="/student-announcements" element={<StudentAnnouncements />} />
        <Route path="/your-courses" element={<YourCoursesPage />} />
        <Route path="/registeration-form" element={<RegisterationForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./courses.css";

function YourCoursesPage() {
  const [yourCourses, setYourCourses] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load student data from localStorage
    const savedStudentData = JSON.parse(localStorage.getItem('studentData'));
    
    if (savedStudentData) {
      setStudentData(savedStudentData);
      setYourCourses(savedStudentData.courses || []);
    }
  }, []);

  const handleRemoveCourse = (courseId) => {
    // Update both student data and courses list
    const updatedStudentData = {
      ...studentData,
      courses: studentData.courses.filter(course => course.id !== courseId)
    };
    
    setStudentData(updatedStudentData);
    setYourCourses(updatedStudentData.courses);
    
    // Save updated student data
    localStorage.setItem('studentData', JSON.stringify(updatedStudentData));
  };

  const handleBackToCatalog = () => {
    navigate('/courses');
  };

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1>Your Registered Courses</h1>
        {studentData && (
          <div className="student-info">
            <p>Student: {studentData.name} ({studentData.registerNumber})</p>
            <p>Email: {studentData.email}</p>
          </div>
        )}
        <button 
          onClick={handleBackToCatalog}
          className="back-button"
        >
          Back to Course Catalog
        </button>
      </div>

      <div className="course-list">
        {yourCourses.length > 0 ? (
          yourCourses.map((course) => (
            <div className="course-card" key={course.id}>
              <div className={`course-badge ${course.type === "New" ? "new" : "rerun"}`}>
                {course.type === "New" ? "New Course" : "Rerun Course"}
              </div>
              <div className="course-content">
                <h3>{course.title}</h3>
                <p className="institution">{course.institution}</p>
                
                {course.registrationDetails && (
                  <div className="registration-details">
                    <h4>Your Registration:</h4>
                    <p><strong>Registered On:</strong> {new Date(course.registeredOn).toLocaleDateString()}</p>
                  </div>
                )}
                
                <div className="course-meta">
                  <span><strong>Duration:</strong> {course.duration}</span>
                  <span><strong>Level:</strong> {course.level}</span>
                  <span><strong>Category:</strong> {course.category}</span>
                </div>
                <div className="course-dates">
                  <span><strong>Starts:</strong> {course.startDate}</span>
                  <span><strong>Ends:</strong> {course.endDate}</span>
                </div>
                <div className="course-actions">
                  <button 
                    onClick={() => window.open(course.url, '_blank')}
                    className="enroll-button"
                  >
                    View Course
                  </button>
                  <button 
                    onClick={() => handleRemoveCourse(course.id)}
                    className="remove-button"
                  >
                    Unregister
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>You haven't registered for any courses yet. Browse courses and click "Register" to enroll.</p>
            <button 
              onClick={handleBackToCatalog}
              className="back-button"
            >
              Browse Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default YourCoursesPage;
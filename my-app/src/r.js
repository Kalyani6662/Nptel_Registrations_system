import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./courses.css";
import RegistrationForm from "./RegistrationForm";

const courses = {
  allCourses: [
    { 
      id: "noc25-ae01", 
      title: "Advanced Aircraft Control Systems with MATLAB/SIMULINK", 
      institution: "IIT Kanpur", 
      approved: true,
      duration: "12 Weeks",
      startDate: "January 20, 2025",
      endDate: "April 11, 2025",
      type: "New",
      level: "UG/PG",
      category: "Core",
      fdp: "Yes",
      domain: "Flight Mechanics",
      url: "https://onlinecourses.nptel.ac.in/noc25_ae01/preview"
    }
  ]
};

function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState("allCourses");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleEnroll = (courseUrl) => {
    window.open(courseUrl, '_blank');
  };

  const handleAddCourse = (course) => {
    setSelectedCourse(course);
  };

  const handleRegistrationComplete = () => {
    setSelectedCourse(null);
    navigate('/your-courses');
  };

  const handleRegistrationCancel = () => {
    setSelectedCourse(null);
  };

  const filteredCourses = courses.allCourses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.institution.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory === "core") {
      matchesCategory = course.category === "Core";
    } else if (selectedCategory === "elective") {
      matchesCategory = course.category === "Elective";
    } else if (selectedCategory === "flight") {
      matchesCategory = course.domain && course.domain.includes("Flight Mechanics");
    } else if (selectedCategory === "fdp") {
      matchesCategory = course.fdp === "Yes";
    }
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="courses-container">
      {selectedCourse ? (
        <RegistrationForm 
          course={selectedCourse}
          onComplete={handleRegistrationComplete}
          onCancel={handleRegistrationCancel}
        />
      ) : (
        <>
          <div className="courses-header">
            <h1>Aerospace Engineering Course Catalog</h1>
            <p className="subtitle">Explore NPTEL Courses from Premier Institutions</p>
            
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search courses, institutions, or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="category-selector">
            <button 
              onClick={() => handleCategoryChange("allCourses")} 
              className={selectedCategory === "allCourses" ? "active" : ""}
            >
              All Courses
            </button>
            <button 
              onClick={() => handleCategoryChange("core")} 
              className={selectedCategory === "core" ? "active" : ""}
            >
              Core Courses
            </button>
            <button 
              onClick={() => handleCategoryChange("elective")} 
              className={selectedCategory === "elective" ? "active" : ""}
            >
              Electives
            </button>
            <button 
              onClick={() => handleCategoryChange("flight")} 
              className={selectedCategory === "flight" ? "active" : ""}
            >
              Flight Mechanics
            </button>
            <button 
              onClick={() => handleCategoryChange("fdp")} 
              className={selectedCategory === "fdp" ? "active" : ""}
            >
              FDP Courses
            </button>
          </div>

          <div className="course-list">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div className="course-card" key={course.id}>
                  <div className={`course-badge ${course.type === "New" ? "new" : "rerun"}`}>
                    {course.type === "New" ? "New Course" : "Rerun Course"}
                  </div>
                  <div className="course-content">
                    <h3>{course.title}</h3>
                    <p className="institution">{course.institution}</p>
                    <div className="course-meta">
                      <span><strong>Duration:</strong> {course.duration}</span>
                      <span><strong>Level:</strong> {course.level}</span>
                      <span><strong>Category:</strong> {course.category}</span>
                      {course.domain && <span><strong>Domain:</strong> {course.domain}</span>}
                      <span><strong>FDP:</strong> {course.fdp}</span>
                    </div>
                    <div className="course-dates">
                      <span><strong>Starts:</strong> {course.startDate}</span>
                      <span><strong>Ends:</strong> {course.endDate}</span>
                    </div>
                    <div className="course-actions">
                      <button 
                        onClick={() => handleEnroll(course.url)} 
                        className="enroll-button"
                      >
                        View Course
                      </button>
                      <button 
                        onClick={() => handleAddCourse(course)} 
                        className="add-course-button"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No courses found matching your criteria. Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CoursesPage;
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./courseRegistration.css";

function RegisterPage() {
  const { id } = useParams(); // Get course ID from URL
  const navigate = useNavigate();

  // Dummy course data for registration (can be expanded or fetched from an API)
  const courses = {
    firstYear: [
      { id: 1, title: "Mathematics I" },
      { id: 2, title: "Physics I" },
      // Add other courses here...
    ],
    // Add other years and courses...
  };

  let selectedCourse = null;

  // Find the course based on the ID
  for (const year in courses) {
    selectedCourse = courses[year].find((course) => course.id === parseInt(id));
    if (selectedCourse) break;
  }

  if (!selectedCourse) {
    return <h2>❌ Course Not Found!</h2>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic (e.g., API call to register)
    alert(`You have successfully registered for ${selectedCourse.title}`);
    navigate("/courses");
  };

  return (
    <div className="register-container">
      <button className="back-button" onClick={() => navigate(-1)}>⬅ Back</button>
      <h1>Register for {selectedCourse.title}</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="contact">Contact Number</label>
          <input type="text" id="contact" name="contact" required />
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;

import React, { useState } from "react";
import "./courses.css";

function RegistrationForm({ course, onComplete, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    registerNumber: "",
    email: "",
    courseName: course.title
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get or initialize student data
    const studentData = JSON.parse(localStorage.getItem('studentData')) || {
      name: formData.name,
      registerNumber: formData.registerNumber,
      email: formData.email,
      courses: []
    };
    
    // Update student data if it already exists
    if (!studentData.name) {
      studentData.name = formData.name;
      studentData.registerNumber = formData.registerNumber;
      studentData.email = formData.email;
    }
    
    // Add course to student's courses if not already present
    if (!studentData.courses.some(c => c.id === course.id)) {
      const courseWithRegistration = {
        ...course,
        registrationDetails: {
          name: formData.name,
          registerNumber: formData.registerNumber,
          email: formData.email
        },
        registeredOn: new Date().toISOString()
      };
      
      studentData.courses.push(courseWithRegistration);
    }
    
    // Save updated student data
    localStorage.setItem('studentData', JSON.stringify(studentData));
    
    onComplete();
  };

  return (
    <div className="registration-form-container">
      <h2>Course Registration</h2>
      <p>Please fill in your details for: <strong>{course.title}</strong></p>
      
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="registerNumber">Register Number:</label>
          <input
            type="text"
            id="registerNumber"
            name="registerNumber"
            value={formData.registerNumber}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Course Name:</label>
          <input
            type="text"
            value={formData.courseName}
            readOnly
            disabled
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">Register</button>
          <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default RegistrationForm;
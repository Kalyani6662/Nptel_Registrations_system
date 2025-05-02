// Help.js
import React from 'react';
import './Help.css';

const Help = () => {
  return (
    <div className="help-container">
      <h1>Help Center</h1>
      
      <div className="help-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>How do I reset my password?</h3>
          <p>Click on "Forgot Password" on the login page and follow the instructions sent to your email.</p>
        </div>
        <div className="faq-item">
          <h3>How do I submit an assignment?</h3>
          <p>Go to the Assignments section, select the assignment, and upload your file.</p>
        </div>
        <div className="faq-item">
          <h3>Where can I view my certificates?</h3>
          <p>All your earned certificates are available in the Certificates section.</p>
        </div>
      </div>
      
      <div className="help-section">
        <h2>Contact Support</h2>
        <p>If you need further assistance, please contact our support team:</p>
        <ul>
          <li>Email: support@vfstrlearning.edu</li>
          <li>Phone: +1 (555) 123-4567</li>
          <li>Office Hours: Mon-Fri, 9AM-5PM</li>
        </ul>
      </div>
    </div>
  );
};

export default Help;
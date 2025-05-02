import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentAssignments.css';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentAssignments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.regNumber) {
          throw new Error("User data not found");
        }

        const response = await axios.get(`http://localhost:5000/assignments/student/${userData.regNumber}`);
        setAssignments(response.data);
      } catch (err) {
        setError("Failed to fetch your assignments. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentAssignments();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="student-assignments-container">
      <div className="header">
        <h1>Your Assignments</h1>
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
      </div>

      {error && (
        <div className="error-message">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your assignments...</p>
        </div>
      ) : (
        <div className="assignments-table">
          {assignments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Assignment</th>
                  <th>Submitted On</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment._id}>
                    <td>{assignment.courseName}</td>
                    <td>{assignment.assignmentName}</td>
                    <td>{formatDate(assignment.submissionDate)}</td>
                    <td className={`grade ${assignment.grade >= 70 ? 'high' : assignment.grade >= 50 ? 'medium' : 'low'}`}>
                      {assignment.grade || '-'}
                    </td>
                    <td>
                      <span className={`status-badge ${assignment.status}`}>
                        {assignment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-assignments">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
                alt="No assignments"
                className="no-assignments-image"
              />
              <h3>No assignments found</h3>
              <p>You haven't submitted any assignments yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;
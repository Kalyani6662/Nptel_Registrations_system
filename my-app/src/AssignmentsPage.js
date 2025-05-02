import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import './AssignmentsPage.css';

Chart.register(...registerables);

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    studentName: '',
    regNumber: '',
    courseName: '',
    assignmentName: '',
    grade: '',
    status: 'submitted',
    fileUrl: ''
  });
  const [stats, setStats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch assignments and stats
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const assignmentsRes = await axios.get('http://localhost:5000/assignments');
        setAssignments(assignmentsRes.data);
        
        // Try to fetch stats, but don't fail if endpoint doesn't exist
        try {
          const statsRes = await axios.get('http://localhost:5000/assignments/stats');
          setStats(statsRes.data);
        } catch (statsError) {
          console.log("Stats endpoint not available, using sample data");
          setStats([
            { _id: "Mathematics", count: 15, avgGrade: 75 },
            { _id: "Science", count: 10, avgGrade: 82 },
            { _id: "History", count: 8, avgGrade: 68 }
          ]);
        }
      } catch (err) {
        setError('Failed to load assignments data');
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment(prev => ({ ...prev, [name]: value }));
  };

  // Submit new assignment
  const submitAssignment = async (e) => {
    e.preventDefault();
    
    if (!newAssignment.studentName || !newAssignment.regNumber || 
        !newAssignment.courseName || !newAssignment.assignmentName) {
      setError('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await axios.post('http://localhost:5000/assignments', newAssignment);
      
      if (response.data && response.data.message === "✅ Assignment added successfully!") {
        setSuccess('Assignment submitted successfully!');
        // Refresh assignments list
        const assignmentsRes = await axios.get('http://localhost:5000/assignments');
        setAssignments(assignmentsRes.data);
        // Reset form
        setNewAssignment({
          studentName: '',
          regNumber: '',
          courseName: '',
          assignmentName: '',
          grade: '',
          status: 'submitted',
          fileUrl: ''
        });
      } else {
        setError('Unexpected response from server');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          'Failed to submit assignment';
      setError(errorMessage);
      console.error("Submission error:", err);
    } finally {
      setIsLoading(false);
      // Clear messages after 3 seconds
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
    }
  };

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => 
    assignment.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Chart data
  const courseDistributionData = {
    labels: stats.map(stat => stat._id),
    datasets: [{
      data: stats.map(stat => stat.count),
      backgroundColor: [
        '#8A2BE2', '#4a90e2', '#f39c12', '#e74c3c', 
        '#2ecc71', '#3498db', '#9b59b6', '#1abc9c'
      ],
      borderWidth: 1
    }]
  };

  const gradeDistributionData = {
    labels: ['A (90-100)', 'B (80-89)', 'C (70-79)', 'D (60-69)', 'F (<60)'],
    datasets: [{
      label: 'Grade Distribution',
      data: [15, 25, 30, 20, 10], // Sample data - replace with real data if available
      backgroundColor: '#8A2BE2',
      borderColor: '#7B1FA2',
      borderWidth: 1
    }]
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`assignments-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header">
        <h1>Assignment Management</h1>
        <button 
          onClick={toggleDarkMode} 
          className="theme-toggle"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search by Reg Number, Name or Course"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="stats-container">
  <div className="stat-card">
    <div className="stat-value">{assignments.length}</div>
    <div className="stat-label">Total Assignments</div>
  </div>
  <div className="stat-card">
    <div className="stat-value">
      {assignments.reduce((sum, assignment) => sum + (assignment.grade ? 1 : 0), 0)}
    </div>
    <div className="stat-label">Graded Assignments</div>
  </div>
  <div className="stat-card">
    <div className="stat-value">
      {assignments.length > 0 
        ? Math.round(
            assignments.reduce((sum, assignment) => sum + (assignment.grade || 0), 0) / 
            assignments.filter(a => a.grade).length
          ) 
        : 0
      }%
    </div>
    <div className="stat-label">Avg Grade</div>
  </div>
</div>
      <div className="form-section">
        <h2>Submit New Assignment</h2>
        <form onSubmit={submitAssignment} className="form-grid">
          <div className="form-group">
            <label>Student Name</label>
            <input
              type="text"
              name="studentName"
              value={newAssignment.studentName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Registration Number</label>
            <input
              type="text"
              name="regNumber"
              value={newAssignment.regNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Course Name</label>
            <input
              type="text"
              name="courseName"
              value={newAssignment.courseName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Assignment Name</label>
            <input
              type="text"
              name="assignmentName"
              value={newAssignment.assignmentName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Grade (0-100)</label>
            <input
              type="number"
              name="grade"
              min="0"
              max="100"
              value={newAssignment.grade}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={newAssignment.status}
              onChange={handleChange}
            >
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
              <option value="late">Late</option>
            </select>
          </div>
          <div className="form-group">
            <label>File URL</label>
            <input
              type="text"
              name="fileUrl"
              value={newAssignment.fileUrl}
              onChange={handleChange}
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="submit-btn"
          >
            {isLoading ? 'Submitting...' : 'Submit Assignment'}
          </button>
        </form>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Assignment Distribution by Course</h3>
          <div className="chart-wrapper">
            <Pie data={courseDistributionData} />
          </div>
        </div>
        <div className="chart-card">
          <h3>Grade Distribution</h3>
          <div className="chart-wrapper">
            <Bar 
              data={gradeDistributionData} 
              options={{
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      <div className="assignments-table">
        <h2>Assignment Submissions</h2>
        {isLoading ? (
          <div className="loading">Loading assignments...</div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Reg No</th>
                  <th>Course</th>
                  <th>Assignment</th>
                  <th>Submitted</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment) => (
                    <tr key={assignment._id}>
                      <td>{assignment.studentName}</td>
                      <td>{assignment.regNumber}</td>
                      <td>{assignment.courseName}</td>
                      <td>{assignment.assignmentName}</td>
                      <td>{new Date(assignment.submissionDate).toLocaleDateString()}</td>
                      <td className={`grade ${assignment.grade >= 70 ? 'high' : assignment.grade >= 50 ? 'medium' : 'low'}`}>
                        {assignment.grade || '-'}
                      </td>
                      <td>
                        <span className={`status-badge ${assignment.status}`}>
                          {assignment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      {searchTerm ? "No matching assignments found" : "No assignments submitted yet"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsPage;
import React, { useState, useEffect } from "react";
import "./CertificatesPage.css";
import { Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import axios from "axios";

Chart.register(...registerables);

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [newCertificate, setNewCertificate] = useState({
    regNo: "",
    courseName: "",
    email: "",
    issueDate: "",
    certificateUrl: "",
    status: "approved"
  });
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [certsRes, studentsRes] = await Promise.all([
        axios.get("http://localhost:5000/certificates"),
        axios.get("http://localhost:5000/students")
      ]);
      setCertificates(certsRes.data);
      setStudents(studentsRes.data);
      setTotalCertificates(certsRes.data.length);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCertificate({ ...newCertificate, [name]: value });
    
    if (name === "regNo") {
      const student = students.find(s => s.regNumber === value);
      if (student) {
        setNewCertificate(prev => ({
          ...prev,
          email: student.email
        }));
      }
    }
  };

  const addCertificate = async () => {
    if (Object.values(newCertificate).some((value) => !value)) {
      setError("Please fill in all fields!");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:5000/certificates", 
        newCertificate
      );
      
      if (response.data.message) {
        setSuccess("Certificate added successfully!");
        fetchData();
        setNewCertificate({
          regNo: "",
          courseName: "",
          email: "",
          issueDate: "",
          certificateUrl: "",
          status: "approved"
        });
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      console.error("Error adding certificate:", error);
      setError(error.response?.data?.error || "Error adding certificate.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCertificate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this certificate?")) return;
    
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:5000/certificates/${id}`);
      setSuccess("Certificate deleted successfully!");
      fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error deleting certificate:", error);
      setError("Failed to delete certificate.");
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = async () => {
    if (certificates.length === 0) {
      setError("No certificates to export!");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/export-csv", {
        responseType: "blob",
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "certificates.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccess("CSV exported successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      setError("Failed to export certificates.");
    }
  };

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const courseCounts = certificates.reduce((acc, cert) => {
    acc[cert.courseName] = (acc[cert.courseName] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(courseCounts),
    datasets: [
      {
        data: Object.values(courseCounts),
        backgroundColor: [
          "#8a2be2", "#4a90e2", "#f39c12", "#e74c3c", 
          "#2ecc71", "#3498db", "#9b59b6", "#1abc9c",
          "#ff6384", "#36a2eb", "#cc65fe", "#ffce56"
        ],
        borderWidth: 1
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="certificates-container">
      <h1 className="page-title">Manage Certificates</h1>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Reg No or Course Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="form-container">
        <h2 className="form-title">Add New Certificate</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Registration Number</label>
            <input
              type="text"
              name="regNo"
              value={newCertificate.regNo}
              onChange={handleChange}
              list="studentRegNumbers"
              required
            />
            <datalist id="studentRegNumbers">
              {students.map(student => (
                <option key={student._id} value={student.regNumber} />
              ))}
            </datalist>
          </div>
          <div className="form-group">
            <label>Course Name</label>
            <input
              type="text"
              name="courseName"
              value={newCertificate.courseName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={newCertificate.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={newCertificate.issueDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Certificate URL</label>
            <input
              type="text"
              name="certificateUrl"
              value={newCertificate.certificateUrl}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={newCertificate.status}
              onChange={handleChange}
              required
            >
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        <button 
          onClick={addCertificate} 
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? "Adding..." : "Add Certificate"}
        </button>
      </div>

      <div className="action-buttons">
        <button 
          onClick={exportToCSV} 
          disabled={isLoading || certificates.length === 0}
          className="btn btn-secondary"
        >
          Export to CSV
        </button>
      </div>

      <div className="counter">
        <h3>Total Certificates: {totalCertificates}</h3>
        {filteredCertificates.length !== certificates.length && (
          <span>(Filtered: {filteredCertificates.length})</span>
        )}
      </div>

      {isLoading && <div className="loading-spinner"></div>}

      <div className="table-responsive">
        <table className="certificate-table">
          <thead>
            <tr>
              <th>Reg No</th>
              <th>Course Name</th>
              <th>Email</th>
              <th>Issue Date</th>
              <th>Status</th>
              <th>Certificate Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCertificates.length > 0 ? (
              filteredCertificates.map((cert) => (
                <tr key={cert._id}>
                  <td>{cert.regNo}</td>
                  <td>{cert.courseName}</td>
                  <td>{cert.email}</td>
                  <td>{new Date(cert.issueDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${cert.status}`}>
                      {cert.status}
                    </span>
                  </td>
                  <td>
                    <a 
                      href={cert.certificateUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </td>
                  <td>
                    <button 
                      onClick={() => deleteCertificate(cert._id)}
                      disabled={isLoading}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  {searchTerm ? "No matching certificates" : "No certificates"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {Object.keys(courseCounts).length > 0 && (
        <div className="chart-section">
          <h2>Course Distribution</h2>
          <div className="chart-wrapper">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
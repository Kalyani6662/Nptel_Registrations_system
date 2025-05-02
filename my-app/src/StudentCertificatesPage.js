import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';
import './StudentCertificatesPage.css';

const StudentCertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = JSON.parse(localStorage.getItem('userData'));
        if (data && data.regNumber) {
          setUserData(data);
          const response = await axios.get(
            `http://localhost:5000/certificates/student/${data.regNumber}`
          );
          setCertificates(response.data);
        } else {
          setError('User data not found. Please login again.');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load certificates. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [navigate]);

  const handleBackToDashboard = () => {
    navigate('/student-dashboard');
  };

  const handleDownloadCertificate = (certificateUrl, courseName) => {
    saveAs(certificateUrl, `${courseName}-certificate.pdf`);
  };

  const handleViewCertificate = (certificateUrl) => {
    window.open(certificateUrl, '_blank', 'noopener,noreferrer');
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const filteredCertificates = certificates
    .filter(cert => 
      cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.regNo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(cert => 
      filterStatus === 'all' || cert.status === filterStatus
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.issueDate) - new Date(a.issueDate);
      } else {
        return new Date(a.issueDate) - new Date(b.issueDate);
      }
    });

  const statusCounts = certificates.reduce((acc, cert) => {
    acc[cert.status] = (acc[cert.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="student-certificates-container">
      <div className="certificates-header">
        <div className="header-top">
          <button onClick={handleBackToDashboard} className="back-button">
            ← Back to Dashboard
          </button>
          {userData && (
            <div className="student-info">
              <span className="student-name">{userData.name}</span>
              <span className="student-reg">{userData.regNumber}</span>
            </div>
          )}
        </div>
        <h1>My Certificates</h1>
        
        <div className="controls-container">
          <div className="search-filter-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="search-icon">🔍</i>
            </div>
            
            <div className="filter-group">
              <label>Filter by:</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="sort-group">
              <label>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
          
          <div className="status-summary">
            <div className="status-item approved">
              <span className="status-count">{statusCounts.approved || 0}</span>
              <span className="status-label">Approved</span>
            </div>
            <div className="status-item pending">
              <span className="status-count">{statusCounts.pending || 0}</span>
              <span className="status-label">Pending</span>
            </div>
            <div className="status-item rejected">
              <span className="status-count">{statusCounts.rejected || 0}</span>
              <span className="status-label">Rejected</span>
            </div>
            <div className="status-item total">
              <span className="status-count">{certificates.length}</span>
              <span className="status-label">Total</span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading certificates...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      ) : filteredCertificates.length === 0 ? (
        <div className="no-certificates">
          <img src="/images/no-certificates.svg" alt="No certificates" />
          <h3>No certificates found</h3>
          <p>We couldn't find any certificates matching your criteria.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
            }}
            className="clear-filters-btn"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="certificates-list">
          {filteredCertificates.map((cert) => (
            <div key={cert._id} className="certificate-card">
              <div className="certificate-header">
                <div className="certificate-title">
                  <h3>{cert.courseName}</h3>
                  <span className="certificate-id">#{cert._id.slice(-6).toUpperCase()}</span>
                </div>
                <span className={`status-badge ${getStatusBadgeColor(cert.status)}`}>
                  {cert.status}
                </span>
              </div>
              
              <div className="certificate-body">
                <div className="certificate-details">
                  <p className="detail-item">
                    <span className="detail-label">Issued on:</span>
                    <span className="detail-value">
                      {new Date(cert.issueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </p>
                  <p className="detail-item">
                    <span className="detail-label">Registration No:</span>
                    <span className="detail-value">{cert.regNo}</span>
                  </p>
                  <p className="detail-item">
                    <span className="detail-label">Certificate ID:</span>
                    <span className="detail-value">{cert._id}</span>
                  </p>
                </div>
                
                <div className="certificate-preview">
                  {cert.certificateUrl && (
                    <div 
                      className="preview-image"
                      onClick={() => handleViewCertificate(cert.certificateUrl)}
                      style={{ 
                        backgroundImage: `url(/images/certificate-thumbnail.jpg)`,
                        cursor: 'pointer'
                      }}
                      title="Click to view certificate"
                    >
                      <div className="preview-overlay">Click to Preview</div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="certificate-actions">
                <button
                  onClick={() => handleViewCertificate(cert.certificateUrl)}
                  className="view-btn"
                >
                  <i className="icon">👁️</i> View
                </button>
                <button
                  onClick={() => handleDownloadCertificate(cert.certificateUrl, cert.courseName)}
                  disabled={cert.status !== 'approved'}
                  className={`download-btn ${cert.status !== 'approved' ? 'disabled' : ''}`}
                >
                  <i className="icon">📥</i> Download
                </button>
                {cert.status === 'rejected' && (
                  <button className="contact-btn">
                    <i className="icon">✉️</i> Contact Admin
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCertificatesPage;
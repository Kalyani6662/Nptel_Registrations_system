import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from 'date-fns';
import "./StudentAnnouncements.css";

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setIsLoading(true);
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.regNumber) {
          throw new Error("User data not found");
        }
        
        const { data } = await axios.get(
          `http://localhost:5000/announcements/student/${userData.regNumber}`
        );
        setAnnouncements(data);
      } catch (err) {
        setError(err.message || "Failed to fetch announcements");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const toggleExpand = (id) => {
    setExpandedAnnouncement(expandedAnnouncement === id ? null : id);
  };

  const filteredAnnouncements = announcements
    .filter(announcement => {
      if (filter === 'all') return true;
      return announcement.category === filter;
    })
    .filter(announcement => {
      if (!searchTerm) return true;
      return (
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'academic': return '📚';
      case 'event': return '🎉';
      case 'personal': return '👤';
      default: return '📢';
    }
  };

  return (
    <div className="student-announcements-container">
      <h1 className="page-title">Your Announcements</h1>

      <div className="controls">
        <div className="search-filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={filter === 'general' ? 'active' : ''}
              onClick={() => setFilter('general')}
            >
              General
            </button>
            <button 
              className={filter === 'academic' ? 'active' : ''}
              onClick={() => setFilter('academic')}
            >
              Academic
            </button>
            <button 
              className={filter === 'event' ? 'active' : ''}
              onClick={() => setFilter('event')}
            >
              Events
            </button>
            <button 
              className={filter === 'personal' ? 'active' : ''}
              onClick={() => setFilter('personal')}
            >
              Personal
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert error">
          {error}
          <button onClick={() => setError(null)} className="close-btn">
            ×
          </button>
        </div>
      )}

      <div className="announcements-list">
        {isLoading ? (
          <div className="loading">
            <div className="spinner"></div>
            Loading announcements...
          </div>
        ) : filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div 
              key={announcement._id} 
              className={`announcement-card ${announcement.priority} ${
                expandedAnnouncement === announcement._id ? 'expanded' : ''
              }`}
            >
              <div 
                className="announcement-header"
                onClick={() => toggleExpand(announcement._id)}
              >
                <div className="announcement-title">
                  <span className="category-icon">
                    {getCategoryIcon(announcement.category)}
                  </span>
                  <h3>{announcement.title}</h3>
                  <span className="priority-icon">
                    {getPriorityIcon(announcement.priority)}
                  </span>
                </div>
                <div className="announcement-meta">
                  <span className={`category ${announcement.category}`}>
                    {announcement.category}
                  </span>
                  <span className={`priority ${announcement.priority}`}>
                    {announcement.priority}
                  </span>
                  {announcement.startDate && (
                    <span className="date">
                      {format(new Date(announcement.startDate), 'MMM dd, yyyy')}
                      {announcement.endDate && 
                        ` - ${format(new Date(announcement.endDate), 'MMM dd, yyyy')}`}
                    </span>
                  )}
                  {announcement.createdBy && (
                    <span className="author">
                      By: {announcement.createdBy}
                    </span>
                  )}
                </div>
                <div className="expand-icon">
                  {expandedAnnouncement === announcement._id ? '▲' : '▼'}
                </div>
              </div>
              <div className="announcement-content">
                <p>{announcement.content}</p>
                {expandedAnnouncement === announcement._id && (
                  <div className="announcement-footer">
                    <div className="announcement-details">
                      {announcement.targetStudents && announcement.targetStudents.length > 0 && (
                        <div className="target-students">
                          <span>Targeted: </span>
                          {announcement.targetStudents.join(', ')}
                        </div>
                      )}
                      <div className="created-at">
                        Posted: {format(new Date(announcement.createdAt), 'MMM dd, yyyy hh:mm a')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <img src="/no-results.svg" alt="No announcements" />
            <p>No announcements found matching your criteria</p>
            <button onClick={() => {
              setFilter('all');
              setSearchTerm('');
            }}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAnnouncements;
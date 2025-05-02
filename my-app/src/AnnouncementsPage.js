import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./AnnouncementsPage.css";

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    category: "general",
    priority: "medium",
    startDate: "",
    endDate: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch announcements
  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/announcements");
      setAnnouncements(data);
    } catch (err) {
      setError("Failed to fetch announcements");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement({ ...newAnnouncement, [name]: value });
  };

  // Submit new announcement
  // In AnnouncementsPage.js, update the submitAnnouncement function
const submitAnnouncement = async () => {
  if (!newAnnouncement.title || !newAnnouncement.content) {
    setError("Title and content are required!");
    return;
  }

  setIsLoading(true);
  try {
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    // Add targetStudents if it's a personal announcement
    const announcementData = {
      ...newAnnouncement,
      createdBy: userData?.name || 'Admin'
    };

    if (newAnnouncement.category === 'personal') {
      // Here you would typically get the target students from a form field
      announcementData.targetStudents = []; // Add student reg numbers here
    }

    await axios.post("http://localhost:5000/announcements", announcementData);
    setSuccess("Announcement created successfully!");
    fetchAnnouncements();
    setNewAnnouncement({
      title: "",
      content: "",
      category: "general",
      priority: "medium",
      startDate: "",
      endDate: ""
    });
    setTimeout(() => setSuccess(null), 3000);
  } catch (err) {
    setError("Failed to create announcement");
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

  // Delete announcement
  const deleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/announcements/${id}`);
      setSuccess("Announcement deleted successfully!");
      fetchAnnouncements();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to delete announcement");
      console.error(err);
    }
  };

  // Filter announcements
  const filteredAnnouncements = announcements
    .filter(announcement => 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(announcement => 
      activeTab === "all" || announcement.category === activeTab
    );

  // Chart data for announcement statistics
  const announcementStats = {
    labels: ["General", "Academic", "Event", "Urgent"],
    datasets: [
      {
        label: "Announcements by Category",
        data: [
          announcements.filter(a => a.category === "general").length,
          announcements.filter(a => a.category === "academic").length,
          announcements.filter(a => a.category === "event").length,
          announcements.filter(a => a.priority === "high").length
        ],
        backgroundColor: [
          "#8A2BE2",
          "#4a90e2",
          "#f39c12",
          "#e74c3c"
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="announcements-container">
      <h1 className="page-title">Announcements Management</h1>

      {/* Status Messages */}
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      {/* Search and Filter */}
      <div className="controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="tabs">
          <button 
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button 
            className={activeTab === "general" ? "active" : ""}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>
          <button 
            className={activeTab === "academic" ? "active" : ""}
            onClick={() => setActiveTab("academic")}
          >
            Academic
          </button>
          <button 
            className={activeTab === "event" ? "active" : ""}
            onClick={() => setActiveTab("event")}
          >
            Events
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats">
        <div className="stat-card">
          <div className="stat-value">{announcements.length}</div>
          <div className="stat-label">Total Announcements</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {announcements.filter(a => a.priority === "high").length}
          </div>
          <div className="stat-label">Urgent</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {announcements.filter(a => a.category === "academic").length}
          </div>
          <div className="stat-label">Academic</div>
        </div>
      </div>

      {/* Create Announcement Form */}
      <div className="form-container">
        <h2>Create New Announcement</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={newAnnouncement.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Content *</label>
            <textarea
              name="content"
              value={newAnnouncement.content}
              onChange={handleChange}
              rows="4"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={newAnnouncement.category}
              onChange={handleChange}
            >
              <option value="general">General</option>
              <option value="academic">Academic</option>
              <option value="event">Event</option>
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select
              name="priority"
              value={newAnnouncement.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High (Urgent)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={newAnnouncement.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={newAnnouncement.endDate}
              onChange={handleChange}
            />
          </div>
        </div>
        <button 
          onClick={submitAnnouncement} 
          disabled={isLoading}
          className="submit-btn"
        >
          {isLoading ? "Publishing..." : "Publish Announcement"}
        </button>
      </div>

      {/* Announcements Statistics */}
      <div className="chart-container">
        <h2>Announcements Distribution</h2>
        <div className="chart-wrapper">
          <Bar 
            data={announcementStats}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Announcements List */}
      <div className="announcements-list">
        <h2>Current Announcements ({filteredAnnouncements.length})</h2>
        {isLoading ? (
          <div className="loading">Loading announcements...</div>
        ) : filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div 
              key={announcement._id} 
              className={`announcement-card ${announcement.priority}`}
            >
              <div className="announcement-header">
                <h3>{announcement.title}</h3>
                <div className="announcement-meta">
                  <span className={`category ${announcement.category}`}>
                    {announcement.category}
                  </span>
                  <span className={`priority ${announcement.priority}`}>
                    {announcement.priority}
                  </span>
                  {announcement.startDate && (
                    <span className="date">
                      {new Date(announcement.startDate).toLocaleDateString()}
                      {announcement.endDate && ` - ${new Date(announcement.endDate).toLocaleDateString()}`}
                    </span>
                  )}
                </div>
              </div>
              <div className="announcement-content">
                <p>{announcement.content}</p>
              </div>
              <div className="announcement-footer">
                <button 
                  onClick={() => deleteAnnouncement(announcement._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            {searchTerm ? "No matching announcements found" : "No announcements available"}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
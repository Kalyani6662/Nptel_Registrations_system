import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiClock, FiFilm, FiBook, FiSearch, FiBarChart2 } from "react-icons/fi";
import "./StudentVideos.css";

const StudentVideos = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "watchedAt", direction: "desc" });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStudentVideos = async () => {
      setIsLoading(true);
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.regNumber) {
          throw new Error("User data not found");
        }
        
        const response = await axios.get(`http://localhost:5000/videos/student/${userData.regNumber}`);
        setVideos(response.data);
        calculateStats(response.data);
      } catch (err) {
        setError("Failed to fetch your videos. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentVideos();
  }, []);

  const calculateStats = (videoData) => {
    if (!videoData || videoData.length === 0) return;
    
    const courseCount = new Set(videoData.map(v => v.courseName)).size;
    const totalHours = Math.round(videoData.length * 0.5); // Assuming 30min per video
    
    setStats({
      totalVideos: videoData.length,
      courseCount,
      totalHours,
      lastWatched: new Date(Math.max(...videoData.map(v => new Date(v.watchedAt)))) 
    });
  };

  const getCourseColor = (courseName) => {
    const colors = [
      '#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#1abc9c', 
      '#f39c12', '#d35400', '#34495e', '#16a085', '#c0392b'
    ];
    const index = courseName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getCourseColorDark = (courseName) => {
    const colors = [
      '#2980b9', '#27ae60', '#c0392b', '#8e44ad', '#14967b',
      '#d35400', '#a04000', '#2c3e50', '#12836d', '#962d22'
    ];
    const index = courseName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedVideos = React.useMemo(() => {
    let sortableVideos = [...videos];
    if (sortConfig !== null) {
      sortableVideos.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableVideos;
  }, [videos, sortConfig]);

  const filteredVideos = sortedVideos.filter(video =>
    video.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.videoName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="student-videos-container">
      <div className="sv-header">
        <h1>
          <FiFilm className="header-icon" /> My Learning History
        </h1>
        <p className="subtitle">Track your video learning progress</p>
      </div>

      {error && (
        <div className="error-message">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        </div>
      )}

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total-videos">
              <FiFilm />
            </div>
            <div className="stat-content">
              <h3>Total Videos</h3>
              <div className="stat-value">{stats.totalVideos}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon courses">
              <FiBook />
            </div>
            <div className="stat-content">
              <h3>Courses</h3>
              <div className="stat-value">{stats.courseCount}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon hours">
              <FiClock />
            </div>
            <div className="stat-content">
              <h3>Learning Hours</h3>
              <div className="stat-value">{stats.totalHours}+</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon last-watched">
              <FiBarChart2 />
            </div>
            <div className="stat-content">
              <h3>Last Watched</h3>
              <div className="stat-value">
                {stats.lastWatched ? formatDate(stats.lastWatched) : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="search-sort-container">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search videos or courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="videos-table-container">
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your learning history...</p>
          </div>
        ) : (
          <>
            {filteredVideos.length > 0 ? (
              <table className="videos-table">
                <thead>
                  <tr>
                    <th 
                      onClick={() => handleSort("courseName")}
                      className={sortConfig.key === "courseName" ? "sort-active" : ""}
                    >
                      Course {sortConfig.key === "courseName" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th 
                      onClick={() => handleSort("videoName")}
                      className={sortConfig.key === "videoName" ? "sort-active" : ""}
                    >
                      Video {sortConfig.key === "videoName" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th 
                      onClick={() => handleSort("watchedAt")}
                      className={sortConfig.key === "watchedAt" ? "sort-active" : ""}
                    >
                      Watched At {sortConfig.key === "watchedAt" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVideos.map((video) => (
                    <tr key={video._id}>
                      <td data-label="Course">
                        <div className="course-cell">
                          <div 
                            className="course-icon"
                            style={{
                              "--course-color": getCourseColor(video.courseName),
                              "--course-color-dark": getCourseColorDark(video.courseName)
                            }}
                          >
                            {video.courseName.charAt(0).toUpperCase()}
                          </div>
                          <span>{video.courseName}</span>
                        </div>
                      </td>
                      <td data-label="Video">
                        <div className="video-title">
                          <FiFilm className="video-icon" />
                          {video.videoName}
                        </div>
                      </td>
                      <td data-label="Watched At">
                        <div className="date-cell">
                          <FiClock className="date-icon" />
                          {formatDate(video.watchedAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-videos">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
                  alt="No videos"
                  className="no-videos-image"
                />
                <h3>No videos found</h3>
                <p>
                  {searchTerm
                    ? "Try a different search term"
                    : "You haven't watched any videos yet"}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {filteredVideos.length > 0 && (
        <div className="table-footer">
          <div className="footer-info">
            Showing {filteredVideos.length} of {videos.length} videos
          </div>
        </div>
      )}

      <div className="floating-btn">
        <FiSearch />
      </div>
    </div>
  );
};

export default StudentVideos;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./VideosPage.css";

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({
    studentName: "",
    regNumber: "",
    courseName: "",
    videoName: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/videos");
      setVideos(data);
    } catch (err) {
      setError("Failed to fetch videos");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVideo({ ...newVideo, [name]: value });
  };

  const addVideo = async () => {
    if (Object.values(newVideo).some(val => !val)) {
      setError("All fields are required!");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/videos", newVideo);
      setSuccess("Video watched recorded!");
      fetchVideos();
      setNewVideo({
        studentName: "",
        regNumber: "",
        courseName: "",
        videoName: ""
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to add video record");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVideos = videos.filter(video => 
    video.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="videos-container">
      <h1>Video Watched Records</h1>
      
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

      <div className="form-container">
        <h2>Add New Video Watched</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Student Name</label>
            <input
              type="text"
              name="studentName"
              value={newVideo.studentName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Registration Number</label>
            <input
              type="text"
              name="regNumber"
              value={newVideo.regNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Course Name</label>
            <input
              type="text"
              name="courseName"
              value={newVideo.courseName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Video Name</label>
            <input
              type="text"
              name="videoName"
              value={newVideo.videoName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button onClick={addVideo} disabled={isLoading}>
          {isLoading ? "Adding..." : "➕ Add Video Watched"}
        </button>
      </div>

      <div className="counter">
        <h3>Total Videos Watched: {videos.length}</h3>
        {filteredVideos.length !== videos.length && (
          <span className="filtered-count">(Filtered: {filteredVideos.length})</span>
        )}
      </div>

      {isLoading && <div className="loading">Loading...</div>}

      <div className="table-responsive">
        <table className="videos-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Reg Number</th>
              <th>Course</th>
              <th>Video Name</th>
              <th>Watched At</th>
            </tr>
          </thead>
          <tbody>
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
                <tr key={video._id}>
                  <td>{video.studentName}</td>
                  <td>{video.regNumber}</td>
                  <td>{video.courseName}</td>
                  <td>{video.videoName}</td>
                  <td>{new Date(video.watchedAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  {searchTerm ? "No matching videos found" : "No videos watched yet"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VideosPage;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

const images = [
  "https://static.pib.gov.in/WriteReadData/userfiles/image/L3PhBJ71.jpg",
  "https://media.licdn.com/dms/image/v2/C511BAQH7HxWdSE1xzw/company-background_10000/company-background_10000/0/1584496822978/nptel_cover?e=2147483647&v=beta&t=8mjiIw_UfbJ5lgc_F6Rbo46YHmtzVIAG80_nLUOTm3g",
  "https://www.imprzd.com/BroadcastImpression/api/file/displayImageV2/L2hvbWUvZWZzZGF0YS82NV9zZXJ2ZXIvcG9zdEltYWdlLzIwMjUvMS8yOS8yMDI1MDEyOTExNTU0MTAxMDQucG5n",
];

function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const navigateToCourses = () => navigate("/courses");
  const navigateToLoginPanel = () => navigate("/login-panel");

  return (
    <div className="home-page">
      {/* Full-width Image Carousel */}
      <section className="carousel-container">
        <img 
          src={images[currentImageIndex]} 
          alt="NPTEL Learning" 
          className="carousel-image"
        />
      </section>

      {/* Main Content Below Carousel */}
      <main className="main-content">
        {/* Intro Section with Centered Buttons */}
        <section className="intro-section">
          <div className="container">
            <div className="intro-text">
              <h1>Advance Your Career with NPTEL</h1>
            </div>
            <div classname="para">
            <p>Learn from India's top educators at your own pace</p>
            </div>
            
            <div className="button-container">
              <button onClick={navigateToCourses} className="btn-primary">
                Browse Courses
              </button>
              <button onClick={navigateToLoginPanel} className="btn-outline">
                Sign Up Free
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>1000+</h3>
                <p>Courses</p>
              </div>
              <div className="stat-card">
                <h3>10M+</h3>
                <p>Learners</p>
              </div>
              <div className="stat-card">
                <h3>200+</h3>
                <p>Educators</p>
              </div>
              <div className="stat-card">
                <h3>5000+</h3>
                <p>Hours</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <h2>Why Learn with NPTEL?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-chalkboard-teacher"></i>
                </div>
                <h3>Expert Instructors</h3>
                <p>Learn from IIT and IISc professors</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-certificate"></i>
                </div>
                <h3>Certification</h3>
                <p>Earn recognized certificates</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-laptop"></i>
                </div>
                <h3>Flexible Learning</h3>
                <p>Study at your own pace</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <h2>Start Learning Today</h2>
            <p>Join thousands of learners advancing their careers</p>
            <button onClick={navigateToLoginPanel} className="btn-primary">
              Get Started for Free
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
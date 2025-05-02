import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Coursedetails.css";

// Define all courses in a single object (or fetch from API)
const courses = {
    firstYear: [
      { id: 1, title: "Mathematics I", description: "Introduction to calculus and linear algebra.", image: "" },
      { id: 2, title: "Physics I", description: "Basic principles of mechanics and thermodynamics.", image: "" },
      { id: 3, title: "Chemistry I", description: "Introduction to organic and inorganic chemistry.", image: "" },
      { id: 4, title: "Computer Programming", description: "Introduction to C programming and problem-solving.", image: "" },
      { id: 5, title: "Electrical Engineering Basics", description: "Introduction to circuits and electrical systems.", image: "" },
      { id: 6, title: "Mechanical Engineering Basics", description: "Fundamentals of mechanical engineering.", image: "" },
      { id: 7, title: "Engineering Drawing", description: "Basic principles of technical drawing and design.", image: "" },
      { id: 8, title: "Environmental Science", description: "Study of environmental systems and sustainability.", image: "" },
      { id: 9, title: "Mathematics II", description: "Further exploration into differential equations.", image: "" },
      { id: 10, title: "Physics II", description: "Study of waves, optics, and electromagnetism.", image: "" },
      { id: 11, title: "Introduction to Economics", description: "Basic economic principles and theory.", image: "" },
      { id: 12, title: "Introduction to Programming", description: "Introduction to programming with C.", image: "" },
      { id: 13, title: "Discrete Mathematics", description: "Study of logic, set theory, and combinatorics.", image: "" },
      { id: 14, title: "Engineering Mechanics", description: "Fundamentals of statics and dynamics.", image: "" },
      { id: 15, title: "Computer Networks", description: "Introduction to networking and communication protocols.", image: "" },
      { id: 16, title: "Programming with C++", description: "Introduction to object-oriented programming with C++.", image: "" }
    ],
    secondYear: [
      { id: 1, title: "Data Structures", description: "Study of data structures like arrays, linked lists, and trees.", image: "" },
      { id: 2, title: "Algorithms", description: "Introduction to algorithms and complexity analysis.", image: "" },
      { id: 3, title: "Digital Logic Design", description: "Basic principles of digital circuits and logic gates.", image: "" },
      { id: 4, title: "Database Management Systems", description: "Study of database models, SQL, and relational databases.", image: "" },
      { id: 5, title: "Computer Architecture", description: "Understanding the architecture of computer systems.", image: "" },
      { id: 6, title: "Operating Systems", description: "Introduction to operating systems, processes, and memory management.", image: "" },
      { id: 7, title: "Software Engineering", description: "Fundamentals of software development and project management.", image: "" },
      { id: 8, title: "Probability and Statistics", description: "Introduction to probability theory and statistical analysis.", image: "" },
      { id: 9, title: "Computer Networks II", description: "Advanced networking concepts and protocols.", image: "" },
      { id: 10, title: "Linear Algebra", description: "Study of vector spaces and matrix operations.", image: "" },
      { id: 11, title: "Microprocessors", description: "Study of microprocessor architecture and assembly language.", image: "" },
      { id: 12, title: "Discrete Structures", description: "Study of set theory, logic, and combinatorics.", image: "" },
      { id: 13, title: "Web Development", description: "Fundamentals of web development with HTML, CSS, and JavaScript.", image: "" },
      { id: 14, title: "Computer Graphics", description: "Introduction to computer graphics and rendering techniques.", image: "" },
      { id: 15, title: "Java Programming", description: "Introduction to Java and object-oriented programming.", image: "" },
      { id: 16, title: "Artificial Intelligence", description: "Introduction to the concepts of AI, machine learning, and neural networks.", image: "" }
    ],
    thirdYear: [
      { id: 1, title: "Data Science", description: "Introduction to data analysis and statistical methods.", image: "" },
      { id: 2, title: "Machine Learning", description: "Fundamentals of machine learning and predictive modeling.", image: "" },
      { id: 3, title: "Advanced Algorithms", description: "In-depth study of advanced algorithmic techniques.", image: "" },
      { id: 4, title: "Cloud Computing", description: "Introduction to cloud technologies and service models.", image: "" },
      { id: 5, title: "Big Data", description: "Understanding big data technologies and processing methods.", image: "" },
      { id: 6, title: "Networking Protocols", description: "Detailed study of network protocols and communication.", image: "" },
      { id: 7, title: "Cybersecurity", description: "Study of techniques for protecting networks and data.", image: "" },
      { id: 8, title: "Digital Signal Processing", description: "Techniques for processing digital signals and data.", image: "" },
      { id: 9, title: "Web Security", description: "Study of techniques to secure web applications.", image: "" },
      { id: 10, title: "Software Testing", description: "Principles and methods of software testing and debugging.", image: "" },
      { id: 11, title: "Computational Biology", description: "Introduction to computational methods in biology.", image: "" },
      { id: 12, title: "Human-Computer Interaction", description: "Designing user interfaces and improving user experience.", image: "" },
      { id: 13, title: "Embedded Systems", description: "Design and development of embedded systems and applications.", image: "" },
      { id: 14, title: "IoT", description: "Introduction to Internet of Things and its applications.", image: "" },
      { id: 15, title: "Mobile App Development", description: "Development of mobile applications for Android and iOS.", image: "" },
      { id: 16, title: "Natural Language Processing", description: "Study of algorithms and techniques for processing human language.", image: "" }
    ],
    fourthYear: [
      { id: 1, title: "Blockchain Technology", description: "Introduction to blockchain and decentralized applications.", image: "" },
      { id: 2, title: "Advanced Machine Learning", description: "In-depth study of machine learning algorithms and techniques.", image: "" },
      { id: 3, title: "Distributed Systems", description: "Understanding the principles of distributed computing and systems.", image: "" },
      { id: 4, title: "AI in Robotics", description: "Study of AI techniques in robotics and autonomous systems.", image: "" },
      { id: 5, title: "Advanced Databases", description: "Study of advanced topics in database systems.", image: "" },
      { id: 6, title: "Computational Finance", description: "Using algorithms and models for financial analysis.", image: "" },
      { id: 8, title: "Computer Vision", description: "Techniques for enabling computers to interpret visual data.", image: "" },
      { id: 9, title: "Digital Forensics", description: "Study of techniques for analyzing digital data in criminal investigations.", image: "" },
      { id: 10, title: "Software Architecture", description: "Principles of designing scalable and maintainable software systems.", image: "" },
      { id: 11, title: "Cloud Security", description: "Study of security challenges in cloud computing.", image: "" },
      { id: 12, title: "Autonomous Vehicles", description: "Introduction to the technology behind self-driving cars.", image: "" },
      { id: 13, title: "Virtual Reality", description: "Study of virtual reality technologies and applications.", image: "" },
      { id: 14, title: "Augmented Reality", description: "Techniques for developing augmented reality applications.", image: "" },
      { id: 15, title: "Cyber-Physical Systems", description: "Study of systems that combine computer science with physical processes.", image: "" },
      { id: 16, title: "Internet of Things Security", description: "Study of security measures for IoT devices and networks.", image: "" }
    ]
  };

function CourseDetailsPage() {
  const { id } = useParams(); // Get course ID from URL
  const navigate = useNavigate();

  // Find the course from all year categories
  let selectedCourse = null;
  for (const year in courses) {
    selectedCourse = courses[year].find((course) => course.id === parseInt(id));
    if (selectedCourse) break;
  }

  if (!selectedCourse) {
    return <h2>❌ Course Not Found!</h2>;
  }

  return (
    <div className="course-details-container">
      <button className="back-button" onClick={() => navigate(-1)}>⬅ Back</button>
      <h1>{selectedCourse.title}</h1>
      <img src={selectedCourse.image} alt={selectedCourse.title} className="course-image" />
      <p className="course-description">{selectedCourse.description}</p>
      <button className="enroll-button">Start Course</button>
    </div>
  );
}

export default CourseDetailsPage;

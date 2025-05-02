require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/kalyani";

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => {
  console.error("❌ MongoDB Connection Error:", err.message);
  process.exit(1);
});

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// 📌 Student Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  regNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  courses: [
    {
      courseName: String,
      assignmentsCompleted: Number,
      videosWatched: Number,
      score: Number,
      certificateEarned: Boolean,
    },
  ],
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

// 📌 User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  regNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: ['student', 'admin', 'teacher'] },
  password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// 📌 Certificate Schema (Updated with status field)
const certificateSchema = new mongoose.Schema({
  regNo: { type: String, required: true },
  courseName: { type: String, required: true },
  email: { type: String, required: true },
  issueDate: { type: Date, required: true },
  certificateUrl: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['approved', 'pending', 'rejected'],
    default: 'approved'
  }
}, { timestamps: true });

const Certificate = mongoose.model("Certificate", certificateSchema);

// 📌 Video Schema
const videoSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  regNumber: { type: String, required: true },
  courseName: { type: String, required: true },
  videoName: { type: String, required: true },
  watchedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

// 📌 Assignment Schema
const assignmentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  regNumber: { type: String, required: true },
  courseName: { type: String, required: true },
  assignmentName: { type: String, required: true },
  submissionDate: { type: Date, default: Date.now },
  grade: { type: Number, min: 0, max: 100 },
  status: { type: String, enum: ['submitted', 'graded', 'late'], default: 'submitted' },
  fileUrl: { type: String }
}, { timestamps: true });

const Assignment = mongoose.model('Assignment', assignmentSchema);

// 📌 Announcement Schema (updated)
const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['general', 'academic', 'event', 'personal'], default: 'general' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  startDate: { type: Date },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  targetStudents: [{ type: String }], // Array of registration numbers
  createdBy: { type: String } // Admin who created the announcement
});

const Announcement = mongoose.model('Announcement', announcementSchema);

// 📌 Course Registration Schema (new)
const courseRegistrationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  courseId: { type: String, required: true },
  courseName: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' }
}, { timestamps: true });

const CourseRegistration = mongoose.model('CourseRegistration', courseRegistrationSchema);

// ========== ROUTES ========== //

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date()
  });
});

// 📌 Student Routes
app.post("/students", async (req, res) => {
  try {
    const { name, regNumber, email, courses } = req.body;

    if (!name || !regNumber || !email || !Array.isArray(courses)) {
      return res.status(400).json({ message: "❌ All fields are required!" });
    }

    const existingStudent = await Student.findOne({ regNumber });
    if (existingStudent) {
      return res.status(400).json({ message: "❌ Student already exists!" });
    }

    const newStudent = new Student({ name, regNumber, email, courses });
    await newStudent.save();

    res.status(201).json({ message: "✅ Student added successfully!" });
  } catch (error) {
    console.error("❌ Error adding student:", error);
    res.status(500).json({ message: "❌ Server error. Try again later." });
  }
});

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching students!" });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Student deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting student!" });
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "❌ Error updating student!" });
  }
});

// 📌 Authentication Routes
app.post("/register", async (req, res) => {
  const { name, regNumber, email, role, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "❌ User already registered!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      regNumber,
      email,
      role,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "✅ Registration successful!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error. Try again later." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "❌ Invalid credentials!" });
    }
    
    res.status(200).json({
      message: "✅ Login successful!",
      user: { 
        _id: user._id,
        name: user.name, 
        regNumber: user.regNumber,
        email: user.email, 
        role: user.role 
      }
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error!" });
  }
});

app.post("/logout", (req, res) => {
  res.status(200).json({ message: "✅ Logout successful!" });
});

// 📌 Enhanced Certificate Routes
app.post("/certificates", async (req, res) => {
  try {
    const { regNo, courseName, email, issueDate, certificateUrl, status } = req.body;

    if (!regNo || !courseName || !email || !issueDate || !certificateUrl) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newCertificate = new Certificate({
      regNo,
      courseName,
      email,
      issueDate,
      certificateUrl,
      status: status || "approved"
    });

    await newCertificate.save();
    res.status(201).json({ message: "✅ Certificate added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Error adding certificate" });
  }
});

app.get("/certificates", async (req, res) => {
  try {
    const certificates = await Certificate.find();
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: "❌ Error fetching certificates" });
  }
});

// Route to get certificates for a specific student
app.get("/certificates/student/:regNumber", async (req, res) => {
  try {
    const certificates = await Certificate.find({ regNo: req.params.regNumber });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: "❌ Error fetching student certificates" });
  }
});

app.delete("/certificates/:id", async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Certificate deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "❌ Error deleting certificate" });
  }
});

app.get("/export-csv", async (req, res) => {
  try {
    const certificates = await Certificate.find();

    if (!certificates.length) {
      return res.status(404).json({ error: "No certificates found" });
    }

    let csv = "Reg No,Course Name,Email,Issue Date,Status,Certificate URL\n";
    certificates.forEach((cert) => {
      csv += `${cert.regNo},${cert.courseName},${cert.email},${cert.issueDate},${cert.status},${cert.certificateUrl}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("certificates.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: "❌ Error exporting CSV" });
  }
});

// 📌 Video Routes
app.post('/videos', async (req, res) => {
  try {
    const { studentName, regNumber, courseName, videoName } = req.body;
    
    if (!studentName || !regNumber || !courseName || !videoName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newVideo = new Video({
      studentName,
      regNumber,
      courseName,
      videoName
    });

    await newVideo.save();
    res.status(201).json({ message: "✅ Video watched record added!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Error adding video record" });
  }
});

app.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: "❌ Error fetching videos" });
  }
});

app.get('/videos/count', async (req, res) => {
  try {
    const count = await Video.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "❌ Error counting videos" });
  }
});

app.get('/videos/student/:regNumber', async (req, res) => {
  try {
    const videos = await Video.find({ regNumber: req.params.regNumber });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: "❌ Error fetching student videos" });
  }
});

// 📌 Assignment Routes
app.post('/assignments', async (req, res) => {
  try {
    const { studentName, regNumber, courseName, assignmentName, grade, status, fileUrl } = req.body;
    
    if (!studentName || !regNumber || !courseName || !assignmentName) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const newAssignment = new Assignment({
      studentName,
      regNumber,
      courseName,
      assignmentName,
      grade,
      status,
      fileUrl
    });

    await newAssignment.save();
    res.status(201).json({ message: "✅ Assignment added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Error adding assignment" });
  }
});

app.get('/assignments', async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: "❌ Error fetching assignments" });
  }
});

app.get('/assignments/count', async (req, res) => {
  try {
    const count = await Assignment.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "❌ Error counting assignments" });
  }
});

app.get('/assignments/stats', async (req, res) => {
  try {
    const stats = await Assignment.aggregate([
      {
        $group: {
          _id: "$courseName",
          count: { $sum: 1 },
          avgGrade: { $avg: "$grade" }
        }
      }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "❌ Error fetching assignment stats" });
  }
});

app.get('/assignments/student/:regNumber', async (req, res) => {
  try {
    const assignments = await Assignment.find({ regNumber: req.params.regNumber });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: "❌ Error fetching student assignments" });
  }
});

// 📌 Announcement Routes (updated)
app.post('/announcements', async (req, res) => {
  try {
    const { title, content, category, priority, startDate, endDate, targetStudents } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const userData = req.user || JSON.parse(req.headers['user-data'] || '{}');
    
    const newAnnouncement = new Announcement({
      title,
      content,
      category,
      priority,
      startDate,
      endDate,
      targetStudents: targetStudents || [],
      createdBy: userData.name || 'Admin'
    });

    await newAnnouncement.save();
    res.status(201).json({ 
      message: "Announcement created successfully", 
      announcement: newAnnouncement 
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating announcement" });
  }
});

app.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: "Error fetching announcements" });
  }
});

// Get announcements for specific student
app.get('/announcements/student/:regNumber', async (req, res) => {
  try {
    const announcements = await Announcement.find({
      $or: [
        { category: 'general' },
        { category: 'academic' },
        { category: 'event' },
        { targetStudents: req.params.regNumber }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: "Error fetching student announcements" });
  }
});

app.delete('/announcements/:id', async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting announcement" });
  }
});

// 📌 Course Registration Routes (new)
app.post('/courses/register', async (req, res) => {
  try {
    const { studentId, ...registrationData } = req.body;
    
    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check if already registered
    const existingRegistration = await CourseRegistration.findOne({
      studentId,
      courseId: registrationData.courseId
    });
    
    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this course' });
    }
    
    // Create new registration
    const registration = new CourseRegistration({
      studentId,
      ...registrationData
    });
    
    await registration.save();
    
    // Update student's courses
    await Student.findByIdAndUpdate(studentId, {
      $push: { courses: registration._id }
    });
    
    res.status(201).json({
      message: 'Successfully registered for the course',
      course: registration
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/courses/student/:studentId', async (req, res) => {
  try {
    const registrations = await CourseRegistration.find({
      studentId: req.params.studentId
    });
    
    res.json({
      message: 'Courses retrieved successfully',
      courses: registrations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/courses/unregister', async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    
    // Delete the registration
    const result = await CourseRegistration.findOneAndDelete({
      studentId,
      courseId
    });
    
    if (!result) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    // Remove from student's courses
    await Student.findByIdAndUpdate(studentId, {
      $pull: { courses: result._id }
    });
    
    res.json({ message: 'Successfully unregistered from the course' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: '❌ Something broke!',
    message: err.message 
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("📄 API Documentation available at http://localhost:5000/api-docs");
});
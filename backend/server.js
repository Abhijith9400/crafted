// const path = require("path"); // Make sure this line is at the top
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const authRoutes = require("./routes/auth");
// const itemRoutes = require("./routes/item");
// const studentRoutes = require("./routes/studentRoutes");
// const courseRoutes = require("./routes/course");
// const announcementRoutes = require("./routes/announcementRoutes");
// const examRoutes = require("./routes/examRoutes");
// const timetableRoutes = require("./routes/timetableRoutes");
// const adminRoutes = require('./routes/adminRoutes');
// const resultRoutes = require('./routes/resultRoutes');
// const statsRouter = require('./routes/statsRouter');

// const app = express();

// // Serve uploaded PDFs
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/items", itemRoutes);
// app.use("/api/students", studentRoutes);
// app.use("/api/courses", courseRoutes);
// app.use("/api/announcements", announcementRoutes);
// app.use("/exams", examRoutes);
// app.use("/api/timetable", timetableRoutes);
// app.use('/api/admin', adminRoutes);
// app.use("/api/results", resultRoutes);
// app.use("/api/stats", statsRouter);


// // Health check endpoint
// app.get("/api/health", (req, res) => {
//     res.json({ status: "ok", time: new Date().toISOString() });
// });

// // Connect to MongoDB
// mongoose
//     .connect(process.env.MONGO_URI)
//     .then(() => {
//         console.log("✅ MongoDB Connected");
//         app.listen(process.env.PORT, () =>
//             console.log(`🚀 Server running on port ${process.env.PORT}`)
//         );
//     })
//     .catch((err) => console.log(err));
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/item");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/course");
const announcementRoutes = require("./routes/announcementRoutes");
const examRoutes = require("./routes/examRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const adminRoutes = require('./routes/adminRoutes');
const resultRoutes = require('./routes/resultRoutes');
const statsRouter = require('./routes/statsRouter');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));   // 🔥 FIX UPLOAD CRASH

// REMOVE THIS (not needed for Cloudinary)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/exams", examRoutes);
app.use("/api/timetable", timetableRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/stats", statsRouter);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
});

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");
        app.listen(process.env.PORT, () =>
            console.log(`🚀 Server running on port ${process.env.PORT}`)
        );
    })
    .catch((err) => console.log(err));

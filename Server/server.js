// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");

// const app = express();
// const PORT = 4000;

// app.use(cors());
// app.use(express.json({ limit: "50mb" })); 

// const MONGO_URI = "mongodb+srv://sarthakameriya_db_user:ZtnV1a1Qg0CfVf9w@cluster0.phnw8ne.mongodb.net/face_attendance?retryWrites=true&w=majority&appName=Cluster0";

// mongoose.connect(MONGO_URI)
//   .then(() => console.log("MongoDB Connected Successfully"))
//   .catch((err) => console.error("MongoDB Connection Error:", err));

// const userRoutes = require("./routes/userRoutes");             // Registration
// const attendanceRoutes = require("./routes/dailyAttendance"); // Daily Attendance

// app.use("/api/users", userRoutes);     // Reg link: http://localhost:4000/api/users/register
// app.use("/api/daily", attendanceRoutes); // Att link: http://localhost:4000/api/daily/mark

// app.get("/", (req, res) => {
//   res.send("API is Running...");
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

const express = require("express");
const cors = require("cors"); 
const mongoose = require("mongoose");

const app = express();
const PORT = 4000;

// ==================================================
// 🔐 CORS SECURITY FIX ( The Nuclear Option )
// ==================================================
app.use(cors({
  origin: "http://localhost:5173", // <--- Allow ONLY your Frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Manual Backup: If the library fails, these headers force the browser to accept it.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json({ limit: "50mb" })); 

const MONGO_URI = "mongodb+srv://sarthakameriya_db_user:ZtnV1a1Qg0CfVf9w@cluster0.phnw8ne.mongodb.net/face_attendance?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Import Routes
const userRoutes = require("./routes/userRoutes"); 
const attendanceRoutes = require("./routes/dailyAttendance"); 

// Mount Routes
app.use("/api/users", userRoutes); 
app.use("/api/daily", attendanceRoutes);

// 🏥 HEALTH CHECK ROUTE (The Pulse)
app.get("/", (req, res) => {
  res.status(200).send("API is Running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
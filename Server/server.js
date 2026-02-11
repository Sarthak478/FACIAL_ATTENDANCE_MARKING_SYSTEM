const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json({ limit: "50mb" })); 

const MONGO_URI = "mongodb+srv://sarthakameriya_db_user:ZtnV1a1Qg0CfVf9w@cluster0.phnw8ne.mongodb.net/face_attendance?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const userRoutes = require("./routes/userRoutes");             // Registration
const attendanceRoutes = require("./routes/dailyAttendance"); // Daily Attendance

app.use("/api/users", userRoutes);     // Reg link: http://localhost:4000/api/users/register
app.use("/api/daily", attendanceRoutes); // Att link: http://localhost:4000/api/daily/mark

app.get("/", (req, res) => {
  res.send("API is Running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
const mongoose = require("mongoose");

// --- 1. THE USER SCHEMA (Profile + Face Data) ---
const userSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        unique: true, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        unique: true,
    },
    mobileNumber: { 
        type: String, 
        unique: true, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ["student", "faculty", "admin"], 
        default: "student" 
    },
    
    // MERGED FACE DATA (The Vector)
    faceEmbedding: { 
        type: [Number],  // Stores the 128 or 512 embedding values
        // required: true, // Recommended: keep required false initially if you save profile first, then embedding
        default: [],
        select: true    // Optimizes queries by not fetching this unless asked
    },
    
    status: { 
        type: String, 
        enum: ["active", "inactive"], 
        default: "active" 
    }
}, { timestamps: true });

// --- 2. THE ATTENDANCE SCHEMA ---
const attendanceSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true, 
        ref: 'User' // Creates a link to the User collection
    }, 
    date: { 
        type: String, 
        required: true 
    }, // Format: "YYYY-MM-DD"
    
    time: { 
        type: String, 
        required: true 
    }, // Format: "HH:mm:ss"
    
    confidence: Number,
    cameraId: String
});

// Prevent duplicate attendance for the same user on the same day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

// --- MODELS ---

// 1. USER MODEL -> FORCED TO 'attendance' COLLECTION
// The 3rd argument "attendance" tells Mongoose: "Save this in the 'attendance' collection."
const User = mongoose.model("User", userSchema, "attendance");

// 2. ATTENDANCE LOGS MODEL -> 'attendance_logs' COLLECTION
// Since 'attendance' is now used for Users, we save daily logs in a separate collection 
// to avoid mixing User Profiles with Daily Logs.
const Attendance = mongoose.model("Attendance", attendanceSchema, "attendance_logs");

module.exports = { User, Attendance };
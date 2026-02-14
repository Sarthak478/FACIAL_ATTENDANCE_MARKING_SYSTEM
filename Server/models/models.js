const mongoose = require('mongoose');

// --- 1. User Schema (Students & Faculty) ---
const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true }, 
    role: { type: String, required: true, enum: ['student', 'faculty', 'admin'] },
    faceEmbedding: { type: [Number], required: true }, 
    createdAt: { type: Date, default: Date.now }
});

// --- 2. Admin Schema (Admins) ---
const AdminSchema = new mongoose.Schema({
    adminId: { type: String, required: true, unique: true }, 
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true }, 
    role: { type: String, default: 'admin' },
    faceEmbedding: { type: [Number], required: true }, 
    createdAt: { type: Date, default: Date.now }
});

// --- 3. Attendance Schema (Logs) ---
const AttendanceSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    confidence: { type: Number, required: true },
    cameraId: { type: String, required: true },
    role: { type: String } 
});

const User = mongoose.model('User', UserSchema);
const Admin = mongoose.model('Admin', AdminSchema);
const Attendance = mongoose.model('Attendance', AttendanceSchema,"attendance_logs");

module.exports = { User, Admin, Attendance };
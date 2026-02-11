const express = require("express");
const router = express.Router();

// --- FIX: Destructure 'Attendance' but rename it to 'AttendanceLog' ---
const { User, Attendance: AttendanceLog } = require("../models/models"); 

// POST /api/daily/mark
router.post("/mark", async (req, res) => {
    try {
        const { vector } = req.body;

        if (!vector || vector.length === 0) {
            return res.status(400).json({ success: false, message: "No face data" });
        }

        // --- STEP 1: SEARCH EXISTING USERS (Read-Only) ---
        const pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index",   
                    "path": "faceEmbedding",   
                    "queryVector": vector,
                    "numCandidates": 50,
                    "limit": 1
                }
            },
            {
                "$project": {
                    "userId": 1,
                    "name": 1,
                    "role": 1,
                    "score": { "$meta": "vectorSearchScore" }
                }
            }
        ];

        const results = await User.aggregate(pipeline);
        
        // Safety check: Ensure results exist before accessing [0]
        if (!results || results.length === 0) {
             return res.json({ success: false, message: "Face not recognized" });
        }

        const bestMatch = results[0];

        // Threshold check (0.85 - 0.90 is standard)
        if (bestMatch.score < 0.85) {
            return res.json({ success: false, message: "Face not recognized" });
        }

        // --- STEP 2: SAVE TO NEW ATTENDANCE LOGS ---
        const today = new Date().toISOString().split('T')[0]; 
        
        // NOW 'AttendanceLog' IS DEFINED correctly
        const log = await AttendanceLog.findOneAndUpdate(
            { userId: bestMatch.userId, date: today }, 
            {
                $setOnInsert: {
                    userId: bestMatch.userId,
                    name: bestMatch.name,       
                    date: today,
                    time: new Date().toLocaleTimeString(),
                    confidence: bestMatch.score, // Fixed: schema uses 'confidence', not 'confidenceScore'
                    cameraId: "Main_Gate_Cam"    // Fixed: schema uses 'cameraId', not 'device'
                }
            },
            { upsert: true, new: true } 
        );

        // --- STEP 3: RESPOND TO REACT ---
        res.json({
            success: true,
            user: { 
                name: bestMatch.name, 
                id: bestMatch.userId 
            },
            message: "Attendance Marked!"
        });

    } catch (error) {
        console.error("Daily Attendance Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;
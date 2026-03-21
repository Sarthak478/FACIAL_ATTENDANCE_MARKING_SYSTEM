const express = require('express');
const router = express.Router();
const { Attendance, User } = require('../models/models');
router.post('/mark', async (req, res) => {
    try {
        const { vector } = req.body;
        
        if (!vector) return res.json({ success: false, message: "No face data received" });

        const pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index", 
                    "path": "faceEmbedding",
                    "queryVector": vector,
                    "numCandidates": 100,
                    "limit": 1
                }
            },
            {
                "$project": {
                    "name": 1,
                    "userId": 1,
                    "role": 1,
                    "score": { "$meta": "vectorSearchScore" }
                }
            }
        ];

        const results = await User.aggregate(pipeline);

        if (results.length === 0) {
            return res.json({ success: false, message: "Face not recognized" });
        }

        const match = results[0];
        console.log(`✅ Match Found: ${match.name} (Score: ${match.score.toFixed(4)})`);

        if (match.score > 0.65) {
            const todayDate = new Date().toLocaleDateString(); 

            const existingRecord = await Attendance.findOne({ 
                userId: match._id.toString(),
                date: todayDate 
            });

            if (existingRecord) {
                console.log(`⚠️ Attendance already marked for ${match.name}`);
                return res.json({ 
                    success: true, 
                    user: { name: match.name },
                    message: `Welcome back, ${match.name}! (Already Marked)`
                });
            }

            const newAttendance = new Attendance({
                userId: match._id.toString(),
                name: match.name,
                date: todayDate,
                time: new Date().toLocaleTimeString(),
                confidence: match.score,
                cameraId: "CAM-01", 
                role: match.role || "student"
            });

            await newAttendance.save();
            console.log(`💾 Saved to DB: ${match.name}`);

            return res.json({ 
                success: true, 
                user: { name: match.name },
                message: "Attendance Marked Successfully!" 
            });

        } else {
            console.log(`⛔ Low Score: ${match.score}`);
            return res.json({ success: false, message: "Face not recognized (Low Score)" });
        }

    } catch (err) {
        if (err.code === 11000) {
             console.log("⚠️ Duplicate Key Error caught (Handled gracefully)");
             return res.json({ success: true, message: "Attendance already marked." });
        }

        console.error("💥 Mark Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/history', async (req, res) => {
    try {
        const logs = await Attendance.find().sort({ _id: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
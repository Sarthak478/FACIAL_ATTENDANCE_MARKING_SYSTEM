const express = require('express');
const router = express.Router();
const { Attendance, User } = require('../models/models');

router.post('/mark', async (req, res) => {
    try {
        const { vector } = req.body;
        if (!vector) return res.status(400).json({ success: false, message: "No vector data" });

        // Search for User (Student/Faculty)
        const user = await User.findOne({
            // Simple Euclidean/Cosine check simulated here or use vectorSearch if User has index
            // For now, assuming you have logic here or use Python for matching
            // If Python handles matching, you might send userId here instead of vector.
            // ... (Keep your existing marking logic here) ...
        });

        // Placeholder for successful mark logic if you aren't using vector search here
        // If you need the Vector Search logic for Students too, let me know!
        
        res.json({ success: false, message: "Attendance Logic Placeholder" }); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/history', async (req, res) => {
    try {
        console.log("📅 Fetching Attendance History...");
        
        const logs = await Attendance.find().sort({ date: -1, time: -1 });
        
        console.log(`✅ Found ${logs.length} records.`);
        res.json(logs);

    } catch (err) {
        console.error("History Error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { User, Admin } = require('../models/models');

router.post('/test-register', async (req, res) => {
    try {
        const { userId, name, email, phoneNumber, role, embedding } = req.body;

        console.log(`📥 Registering ${role}: ${name} (${userId})`);

        // --- A. ADMIN REGISTRATION ---
        if (role === 'admin') {
            const existingAdmin = await Admin.findOne({ $or: [{ adminId: userId }, { email }] });
            if (existingAdmin) return res.status(400).json({ message: "Admin ID or Email already exists" });

            const newAdmin = new Admin({
                adminId: userId,
                name,
                email,
                phoneNumber, 
                role: 'admin',
                faceEmbedding: embedding
            });
            await newAdmin.save();
            console.log("✅ Admin Saved Successfully");
            return res.json({ success: true, message: "Admin Registered Successfully!" });
        }

        // --- B. USER REGISTRATION (Student/Faculty) ---
        const existingUser = await User.findOne({ $or: [{ userId }, { email }] });
        if (existingUser) return res.status(400).json({ message: "User ID or Email already exists" });

        const newUser = new User({
            userId, name, email, phoneNumber, role, faceEmbedding: embedding
        });
        await newUser.save();
        console.log("✅ User Saved Successfully");
        res.json({ success: true, message: "User Registered Successfully!" });

    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ error: err.message });
    }
});


router.post('/admin-login', async (req, res) => {
    try {
        const { vector } = req.body;
        if (!vector) return res.status(400).json({ success: false, message: "No face data" });

        console.log(`🔍 Login Attempt: Checking Admin Face...`);

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
                    "name": 1,
                    "adminId": 1,
                    "score": { "$meta": "vectorSearchScore" }
                }
            }
        ];

        const results = await Admin.aggregate(pipeline);

        if (results.length === 0) {
            console.log("❌ No matches found in Admin DB.");
            return res.json({ success: false, message: "Access Denied" });
        }

        const match = results[0];
        console.log(`✅ Best Match: ${match.name} | Score: ${match.score}`);

        if (match.score > 0.75) {
            return res.json({ 
                success: true, 
                admin: { name: match.name, id: match.adminId }
            });
        } else {
            console.log("⛔ Score too low for Admin Access");
            return res.json({ success: false, message: "Access Denied" });
        }

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;
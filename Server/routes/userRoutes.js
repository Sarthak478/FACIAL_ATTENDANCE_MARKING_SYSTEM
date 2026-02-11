const express = require("express");
const router = express.Router();
const { User } = require("../models/models"); // Import the Model

// ROUTE: POST /api/users/test-register
router.post("/test-register", async (req, res) => {
  try {
    console.log("------------------------------------------------");
    console.log("📥 Processing Registration...");

    // 1. Destructure incoming data from React
    const { userId, name, email, phoneNumber, role, embedding } = req.body;

    // 2. Validate Embedding
    if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
        return res.status(400).json({ success: false, message: "Face embedding missing or invalid." });
    }

    // 3. Check for Duplicates (User ID or Email)
    const existingUser = await User.findOne({ $or: [{ userId }, { email }] });
    if (existingUser) {
        console.log("⚠️ User already exists");
        return res.status(400).json({ success: false, message: "User ID or Email already exists." });
    }
    const newUser = new User({
        userId,
        name,
        email,
        mobileNumber: phoneNumber, 
        role,
        faceEmbedding: embedding,
        status: "active"
    });

    // 5. Save to MongoDB
    await newUser.save();

    console.log(`✅ User ${name} (${userId}) saved to DB!`);
    console.log("------------------------------------------------");

    // 6. Send Success Response (Triggers the 'Hurray' screen in React)
    res.status(201).json({ 
        success: true, 
        message: "User Registered Successfully",
        user: {
            userId: newUser.userId,
            name: newUser.name
        }
    });

  } catch (error) {
    console.error("❌ Registration Error:", error);
    
    // Handle Duplicate Key Error (MongoDB Code 11000)
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({ success: false, message: `This ${field} is already registered.` });
    }

    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
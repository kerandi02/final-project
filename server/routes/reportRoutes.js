const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

// @route   POST /api/reports
// @desc    Create a new health report
router.post("/", async (req, res) => {
  try {
    const { symptoms, location } = req.body;

    if (!symptoms || !location) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const newReport = new Report({ symptoms, location });
    await newReport.save();

    res.status(201).json({ message: "Report submitted successfully!", report: newReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while submitting report", error: error.message });
  }
});

module.exports = router;

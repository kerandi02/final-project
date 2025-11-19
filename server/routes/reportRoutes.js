const express = require("express");
const Report = require("../models/Report.js");

const router = express.Router();

/* ---------------------------------------------------------
   GET /api/reports
   Return an array of reports (supports optional pagination via ?limit & ?skip)
--------------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 1000; // large default so frontend gets all
    const skip = parseInt(req.query.skip) || 0;

    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // return array directly to match frontend expectations
    res.json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ error: "Server error fetching reports" });
  }
});

/* ---------------------------------------------------------
   POST /api/reports
   Create a new report. Expects { title, description, location, coords?, severity }
--------------------------------------------------------- */
router.post("/", async (req, res) => {
  const { title, description, location, coords, severity } = req.body;

  // Validation
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: "Title is required" });
  }
  if (severity && !["low", "medium", "high"].includes(severity)) {
    return res.status(400).json({ error: "Invalid severity" });
  }

  try {
    const report = new Report({
      title: title.trim(),
      description: description ? description.trim() : "",
      location: location ? location.trim() : "",
      coords: coords && typeof coords === "object" ? coords : undefined,
      severity: severity || "low",
    });

    const saved = await report.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating report:", err);
    res.status(500).json({ error: "Server error creating report" });
  }
});
// UPDATE report
router.put("/:id", async (req, res) => {
  try {
    const updated = await Report.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update report" });
  }
});
// DELETE report
router.delete("/:id", async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete report" });
  }
});


/* ---------------------------------------------------------
   GET /api/reports/stats
   Return aggregated stats and simple alert triggers
--------------------------------------------------------- */
router.get("/stats", async (req, res) => {
  try {
    const reports = await Report.find();

    const totalReports = reports.length;
    const highSeverity = reports.filter((r) => r.severity === "high").length;

    const last7days = reports.filter((r) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(r.createdAt) >= weekAgo;
    }).length;

    const alerts = [];
    if (highSeverity > 10) alerts.push("High number of severe cases reported!");
    if (last7days > 25) alerts.push("Spike in reports this week!");

    res.json({
      totalReports,
      highSeverity,
      last7days,
      alerts,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to calculate stats" });
  }
});
// GET all reports with pagination
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const skip = parseInt(req.query.skip) || 0;

    const total = await Report.countDocuments();

    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      reports,
      hasMore: skip + limit < total
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching reports" });
  }
});


module.exports = router;

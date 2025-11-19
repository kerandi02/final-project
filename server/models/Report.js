const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    // user-visible location text (address / place name)
    location: {
      type: String,
      default: "",
    },
    // optional coordinates for map visualization
    coords: {
      lat: { type: Number },
      lng: { type: Number },
    },
    // use lowercase values to match the frontend ('low','medium','high')
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);

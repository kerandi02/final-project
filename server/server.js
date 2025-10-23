const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// ✅ Enable CORS for frontend
app.use(cors({
  origin: "http://localhost:3000",  // allow your React app
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// ✅ Routes
const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

// ✅ Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/communityHealth", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

app.listen(5000, () => console.log("Server running on port 5000"));

// backend/server.js

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// Load .env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ Enable CORS for both local and production frontend
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://tour-craft-frontend.vercel.app", // Deployed frontend (Vercel)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is in the allowed origins list
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true); // Allow the origin
      } else {
        callback(new Error("Not allowed by CORS")); // Reject the origin
      }
    },
    credentials: true, // Allow cookies to be sent with the request
  })
);

// Middleware
app.use(express.json({ limit: "300mb" }));
app.use(express.urlencoded({ limit: "300mb", extended: true }));

// Routes
const authRoutes = require("./routes/authRoutes");
const tourRoutes = require("./routes/tourRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// backend/server.js

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const { Server } = require("socket.io");

const io = new Server(4000, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-tour", (tourId) => {
    socket.join(tourId);
    console.log(`Socket ${socket.id} joined room ${tourId}`);
  });

  socket.on("tour-update", ({ tourId, data }) => {
    // Broadcast to all except sender
    socket.to(tourId).emit("tour-update", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

console.log("Socket.io server running on port 4000");

// Load .env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ Enable CORS for your frontend (Vite runs on 5173 by default)
app.use(
  cors({
    origin: "http://localhost:5173", // your React frontend
    credentials: true, // if you ever use cookies
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

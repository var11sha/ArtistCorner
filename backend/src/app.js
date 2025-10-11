// app.js — handles middleware, DB connection, and routes

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
const authRoutes = require("./routes/authRoutes.js");
app.use("/api/auth", authRoutes);


// Default route
app.get("/", (req, res) => {
  res.send("🎨 Artist Corner backend is running smoothly!");
});

module.exports = app;

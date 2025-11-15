// app.js — handles middleware, DB connection, and routes

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import spotifyRoute from "./routes/SpotifyRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import authRoutes from "./routes/authRoutes.js";


// Initialize express
const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/spotify", spotifyRoute);
console.log("✅ [App] Spotify routes loaded");


// Default route
app.get("/", (req, res) => {
  res.send("🎨 Artist Corner backend is running smoothly!");
});

export default app;

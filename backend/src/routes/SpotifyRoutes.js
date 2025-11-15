// routes/spotifyRoute.js
import express from "express";
import { getPlaylistByMood, getTracksByMood, getSinglePlaylist } from "../controllers/SpotifyController.js";

const router = express.Router();

// Example: GET /api/spotify/playlist?mood=study
router.get("/playlist", getPlaylistByMood);
router.get("/tracks", getTracksByMood);
router.get("/playlist/:id", getSinglePlaylist);

console.log("✅ [SpotifyRoutes] GET /playlist route set up");

export default router;

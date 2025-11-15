// routes/spotifyRoute.js
import express from "express";
import { 
  getPlaylistByMood, 
  getTracksByMood, 
  getSinglePlaylist,
  getAlbumsByMood,
  getArtistsByMood,
  getPodcastsByMood
} from "../controllers/SpotifyController.js";

const router = express.Router();

// Example: GET /api/spotify/playlist?mood=study
router.get("/playlist", getPlaylistByMood);
router.get("/tracks", getTracksByMood);
router.get("/albums", getAlbumsByMood);
router.get("/artists", getArtistsByMood);
router.get("/podcasts", getPodcastsByMood);
router.get("/playlist/:id", getSinglePlaylist);

console.log("✅ [SpotifyRoutes] All routes set up");

export default router;

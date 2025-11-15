// config/spotifyConfig.js
import dotenv from "dotenv";
dotenv.config();

export default {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
};
console.log("✅ [SpotifyConfig] Spotify configuration loaded");
// components/spotify.js
import { searchPlaylists, getSinglePlaylistData } from "./spotify/Playlist.js";
import { searchTracks } from "./spotify/Tracks.js";

export const getTracks = async (mood) => {
  // Basic logic (later we’ll enhance with AI)
  const moodKeywords = {
    morning: "energetic",
    night: "chill",
    study: "focus",
    workout: "pump",
    relax: "lofi chill",
  };

  
  const query = moodKeywords[mood] || "popular hits";
  return await searchTracks(query);
};
console.log(`[Spotify] Searching tracks for mood`);

export const getPlaylist = async (mood) => {
  // Basic logic (later we’ll enhance with AI)
  const moodKeywords = {
    morning: "energetic",
    night: "chill",
    study: "focus",
    workout: "pump",
    relax: "lofi chill",
  };

  
  const query = moodKeywords[mood] || "popular hits";
  console.log(`[Spotify] Searching playlists for mood: ${mood} with query: ${query}`);
  return await searchPlaylists(query);
};

export const getPlaylistById = async (playlistId) => {
  console.log(`[Spotify] Fetching playlist by ID: ${playlistId}`);
  return await getSinglePlaylistData(playlistId);
};
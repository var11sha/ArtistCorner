// components/spotify.js
import { searchPlaylists, getSinglePlaylistData } from "./spotify/Playlist.js";
import { searchTracks } from "./spotify/Tracks.js";
import { searchAlbums } from "./spotify/Albums.js";
import { searchArtists } from "./spotify/Artists.js";
import { searchPodcasts } from "./spotify/Podcasts.js";

// Mood to keyword mapping
const moodKeywords = {
  morning: "energetic",
  night: "chill",
  study: "focus",
  workout: "pump",
  relax: "lofi chill",
};

export const getTracks = async (mood) => {
  const query = moodKeywords[mood] || "popular hits";
  return await searchTracks(query);
};

export const getPlaylist = async (mood) => {
  const query = moodKeywords[mood] || "popular hits";
  console.log(`[Spotify] Searching playlists for mood: ${mood} with query: ${query}`);
  return await searchPlaylists(query);
};

export const getAlbums = async (mood) => {
  const query = moodKeywords[mood] || "popular";
  console.log(`[Spotify] Searching albums for mood: ${mood} with query: ${query}`);
  return await searchAlbums(query);
};

export const getArtists = async (mood) => {
  const query = moodKeywords[mood] || "popular";
  console.log(`[Spotify] Searching artists for mood: ${mood} with query: ${query}`);
  return await searchArtists(query);
};

export const getPodcasts = async (mood) => {
  // For podcasts, we use more general terms
  const podcastKeywords = {
    morning: "motivation",
    night: "relaxation",
    study: "educational",
    workout: "fitness",
    relax: "meditation",
  };
  const query = podcastKeywords[mood] || "popular";
  console.log(`[Spotify] Searching podcasts for mood: ${mood} with query: ${query}`);
  return await searchPodcasts(query);
};

export const getPlaylistById = async (playlistId) => {
  console.log(`[Spotify] Fetching playlist by ID: ${playlistId}`);
  return await getSinglePlaylistData(playlistId);
};
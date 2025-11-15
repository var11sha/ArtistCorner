// controllers/spotifyController.js
import { 
  getTracks, 
  getPlaylist, 
  getPlaylistById,
  getAlbums,
  getArtists,
  getPodcasts
} from "../Component/Spotify.js";

export const getTracksByMood = async (req, res) => {
  try {
    const { mood } = req.query;
    const tracks = await getTracks(mood);
    res.status(200).json({ success: true, mood, tracks });
  } catch (error) {
    console.error("[SpotifyController Error]", error);
    res.status(500).json({ success: false, message: "Failed to fetch tracks" });
  }
};

export const getPlaylistByMood = async (req, res) => {
  try {
    const { mood } = req.query;
    console.log(`[SpotifyController] Fetching playlist for mood: ${mood}`);
    const playlists = await getPlaylist(mood);
    res.status(200).json({ success: true, mood, playlists });
  } catch (error) {
    console.error("[SpotifyController Error]", error);
    res.status(500).json({ success: false, message: "Failed to fetch playlist" });
  }
};

export const getAlbumsByMood = async (req, res) => {
  try {
    const { mood } = req.query;
    console.log(`[SpotifyController] Fetching albums for mood: ${mood}`);
    const albums = await getAlbums(mood);
    res.status(200).json({ success: true, mood, albums });
  } catch (error) {
    console.error("[SpotifyController Error]", error);
    res.status(500).json({ success: false, message: "Failed to fetch albums" });
  }
};

export const getArtistsByMood = async (req, res) => {
  try {
    const { mood } = req.query;
    console.log(`[SpotifyController] Fetching artists for mood: ${mood}`);
    const artists = await getArtists(mood);
    res.status(200).json({ success: true, mood, artists });
  } catch (error) {
    console.error("[SpotifyController Error]", error);
    res.status(500).json({ success: false, message: "Failed to fetch artists" });
  }
};

export const getPodcastsByMood = async (req, res) => {
  try {
    const { mood } = req.query;
    console.log(`[SpotifyController] Fetching podcasts for mood: ${mood}`);
    const podcasts = await getPodcasts(mood);
    res.status(200).json({ success: true, mood, podcasts });
  } catch (error) {
    console.error("[SpotifyController Error]", error);
    res.status(500).json({ success: false, message: "Failed to fetch podcasts" });
  }
};


export const getSinglePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: "Playlist ID is required" });

    const playlistData = await getPlaylistById(id);
    res.json(playlistData);
  } catch (error) {
    console.error("[SpotifyController Error]", error.message);
    res.status(500).json({ error: "Failed to fetch playlist details" });
  }
};


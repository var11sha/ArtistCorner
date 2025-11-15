// controllers/spotifyController.js
import { getTracks, getPlaylist, getPlaylistById } from "../Component/Spotify.js";

export const getTracksByMood = async (req, res) => {
  try {
    console.log("✅ [SpotifyController] getTracksByMood controller is set up");
    const { mood } = req.query;
    const tracks = await getTracks(mood);
    res.status(200).json({ success: true, mood, tracks });
    
  } catch (error) {
    console.error("[SpotifyController Error]", error);
    res.status(500).json({ success: false, message: "Failed to fetch playlist" });
  }
};
console.log("✅ [SpotifyController] getPlaylistByMood controller is set up");


export const getPlaylistByMood = async (req, res) => {
  try {
    console.log("✅ [SpotifyController] getPlaylistByMood controller is set up");
    const { mood } = req.query;
    console.log(`[SpotifyController] Fetching playlist for mood: ${mood}`);
    const playlists = await getPlaylist(mood);
    res.status(200).json({ success: true, mood, playlists });
  } catch (error) {
    console.error("[SpotifyController Error]", error);
    res.status(500).json({ success: false, message: "Failed to fetch playlist" });
  }
};
console.log("✅ [SpotifyController] getPlaylistByMood controller is set up");


// export const getPlaylistWithId = async (req, res) => {
//   try {
//     console.log("✅ [SpotifyController] getPlaylistWithId controller is set up");
//     console.log(`[SpotifyController] Request params: ${JSON.stringify(req.params)}`);
//     const { id } = req.params;
//     console.log(`[SpotifyController] Fetching playlist by ID: ${id}`);
//     const playlist = await getPlaylistById(id);
//     res.status(200).json({ success: true, playlist });
//   } catch (error) {
//     console.error("[SpotifyController Error]", error);
//     res.status(500).json({ success: false, message: "Failed to fetch playlist" });
//   }
// };

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


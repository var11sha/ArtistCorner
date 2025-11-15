// src/pages/Playlist.jsx
import React, { useEffect, useState } from "react";
import PlaylistCard from "./Components/playlistCard.js";
import MoodFilter from "./Components/moodFilter.js";

const Playlist = () => {
  const [tracks, setTracks] = useState([]);
  const [mood, setMood] = useState("study");
  const [loading, setLoading] = useState(false);

  const fetchPlaylist = async (selectedMood) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/spotify/playlist?mood=${selectedMood}`
      );
      const data = await res.json();
      setTracks(data.tracks || []);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist(mood);
  }, [mood]);

  return (
    <div className="playlist-page">
      <h1>🎧 Your AI Playlist</h1>
      <p className="subtitle">Auto-generated from your mood or schedule</p>

      <MoodFilter selectedMood={mood} onMoodChange={setMood} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="playlist-grid">
          {tracks.map((track) => (
            <PlaylistCard key={track.url} track={track} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlist;

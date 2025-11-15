// src/components/PlaylistCard.jsx
import React from "react";

const PlaylistCard = ({ track }) => {
  return (
    <div className="playlist-card">
      <img src={track.image} alt={track.name} className="playlist-img" />
      <h3>{track.name}</h3>
      <p>{track.artist}</p>
    </div>
  );
};

export default PlaylistCard;

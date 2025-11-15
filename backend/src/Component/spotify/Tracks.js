// components/spotify/tracks.js
import SpotifyWebApi from "spotify-web-api-node";
import { getAppToken } from "./Token.js";
import config from "../../config/spotifyConfig.js";

const spotifyApi = new SpotifyWebApi({
  clientId: config.clientId,
  clientSecret: config.clientSecret,
});

export async function searchTracks(query) {
  const token = await getAppToken();
  spotifyApi.setAccessToken(token);
  
  const result = await spotifyApi.searchTracks(query, { limit: 10 });
  return result.body.tracks.items.map((track) => ({
    name: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    url: track.external_urls.spotify,
    preview: track.preview_url,
    album: track.album.name,
    image: track.album.images[0]?.url,
  }));
}
console.log(`[Spotify Tracks] Searching tracks with query`);
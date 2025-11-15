// components/spotify/playlists.js
import SpotifyWebApi from "spotify-web-api-node";
import { getAppToken } from "./Token.js";
import config from "../../config/spotifyConfig.js";

const spotifyApi = new SpotifyWebApi({
  clientId: config.clientId,
  clientSecret: config.clientSecret,
});

// Fetch playlists by mood/keyword
export async function searchPlaylists(query) {
  const token = await getAppToken();
  spotifyApi.setAccessToken(token);

  const result = await spotifyApi.searchPlaylists(query, { limit: 10 });
  const playlists = result.body.playlists.items.filter(p => p !== null);


//   console.log(`[Spotify Playlists] Searching playlists with query: ${query}`);
//   console.log(result.body.playlists.items);
    const formatted = playlists.map(p => ({
        id: p.id,
        name: p.name,
        image: p.images?.[0]?.url || "",
        description: p.description || "No description available",
        url: p.external_urls.spotify,
        owner: p.owner?.display_name || "Unknown"
        }));

    // res.json(formatted);
    return formatted;
}

export async function getSinglePlaylistData(playlistId) {
  const token = await getAppToken();
  spotifyApi.setAccessToken(token);

  console.log(`[Spotify] Fetching playlist by ID: ${playlistId}`);
  const result = await spotifyApi.getPlaylist(playlistId);

  const playlist = result.body;
 console.log(playlist);
  return {
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    owner: playlist.owner.display_name,
    image: playlist.images[0]?.url,
    url: playlist.external_urls.spotify,
    totalTracks: playlist.tracks.total,
    tracks: playlist.tracks.items.map((t) => ({
      id: t.track.id,
      name: t.track.name,
      artist: t.track.artists.map((a) => a.name).join(", "),
      album: t.track.album.name,
      preview: t.track.preview_url,
      image: t.track.album.images[0]?.url,
      url: t.track.external_urls.spotify,
    })),
  };
}

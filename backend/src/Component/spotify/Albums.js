// components/spotify/albums.js
import SpotifyWebApi from "spotify-web-api-node";
import { getAppToken } from "./Token.js";
import config from "../../config/spotifyConfig.js";

const spotifyApi = new SpotifyWebApi({
  clientId: config.clientId,
  clientSecret: config.clientSecret,
});

export async function searchAlbums(query) {
  const token = await getAppToken();
  spotifyApi.setAccessToken(token);

  const result = await spotifyApi.searchAlbums(query, { limit: 10 });
  const albums = result.body.albums.items.filter(a => a !== null);

  const formatted = albums.map(album => ({
    id: album.id,
    name: album.name,
    image: album.images?.[0]?.url || "",
    artist: album.artists.map(a => a.name).join(", "),
    releaseDate: album.release_date,
    totalTracks: album.total_tracks,
    url: album.external_urls.spotify,
    albumType: album.album_type
  }));

  return formatted;
}


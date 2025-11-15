// components/spotify/artists.js
import SpotifyWebApi from "spotify-web-api-node";
import { getAppToken } from "./Token.js";
import config from "../../config/spotifyConfig.js";

const spotifyApi = new SpotifyWebApi({
  clientId: config.clientId,
  clientSecret: config.clientSecret,
});

export async function searchArtists(query) {
  const token = await getAppToken();
  spotifyApi.setAccessToken(token);

  const result = await spotifyApi.searchArtists(query, { limit: 10 });
  const artists = result.body.artists.items.filter(a => a !== null);

  const formatted = artists.map(artist => ({
    id: artist.id,
    name: artist.name,
    image: artist.images?.[0]?.url || "",
    followers: artist.followers?.total || 0,
    genres: artist.genres || [],
    popularity: artist.popularity || 0,
    url: artist.external_urls.spotify
  }));

  return formatted;
}


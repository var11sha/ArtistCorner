// components/spotify/podcasts.js
import SpotifyWebApi from "spotify-web-api-node";
import { getAppToken } from "./Token.js";
import config from "../../config/spotifyConfig.js";

const spotifyApi = new SpotifyWebApi({
  clientId: config.clientId,
  clientSecret: config.clientSecret,
});

export async function searchPodcasts(query) {
  const token = await getAppToken();
  spotifyApi.setAccessToken(token);

  // Note: Spotify Web API Node doesn't have direct searchShows method
  // We'll use search with type 'show' parameter
  try {
    const result = await spotifyApi.search(query, ['show'], { limit: 10 });
    const shows = result.body.shows?.items || [];

    const formatted = shows
      .filter(show => show !== null)
      .map(show => ({
        id: show.id,
        name: show.name,
        image: show.images?.[0]?.url || "",
        description: show.description || "No description available",
        publisher: show.publisher || "Unknown",
        totalEpisodes: show.total_episodes || 0,
        url: show.external_urls.spotify
      }));

    return formatted;
  } catch (error) {
    console.error("Error searching podcasts:", error);
    // Fallback: return empty array if podcasts search fails
    return [];
  }
}


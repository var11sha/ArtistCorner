// components/spotify/token.js
import SpotifyWebApi from "spotify-web-api-node";
import config from "../../config/spotifyConfig.js";

const spotifyApi = new SpotifyWebApi({
  clientId: config.clientId,
  clientSecret: config.clientSecret,
});

let appToken = null;

export async function getAppToken() {
  // If token exists and not expired → reuse it
  if (appToken && Date.now() < appToken.expiresAt) {
    return appToken.access;
  }

  // Else request a new one
  const data = await spotifyApi.clientCredentialsGrant();

  appToken = {
    access: data.body.access_token,
    expiresAt: Date.now() + data.body.expires_in * 1000,
  };

 
  return appToken.access;
}
 console.log("✅ [Spotify] Access token refreshed");
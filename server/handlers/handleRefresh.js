require("dotenv").config();
const SpotifyWebAPI = require("spotify-web-api-node");

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

const handleRefresh = (req, res) => {
  const { refreshToken } = req.body;
  const spotifyAPI = new SpotifyWebAPI({
    redirectUri: "http://localhost:3300/",
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    refreshToken,
  });

  spotifyAPI.refreshAccessToken().then(({ body }) => {
    console.log(body.access_token);
    res.status(200).json({
      status: 200,
      message: "Refreshed access token.",
      data: {
        accessToken: body.access_token,
        expiresIn: body.expires_in,
      },
    });
  });
};

module.exports = { handleRefresh };

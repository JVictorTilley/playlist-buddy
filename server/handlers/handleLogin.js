require("dotenv").config();
const SpotifyWebAPI = require("spotify-web-api-node");

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

const handleLogin = (req, res) => {
  const { authCode } = req.body;
  const spotifyAPI = new SpotifyWebAPI({
    redirectUri: "http://localhost:3300/",
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
  });

  spotifyAPI
    .authorizationCodeGrant(authCode)
    .then(({ body }) => {
      console.log(body);
      res.status(200).json({
        accessToken: body.access_token,
        refreshToken: body.refresh_token,
        expiresIn: body.expires_in,
      });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(400)
        .json({ status: 400, message: "Could not log in: " + err });
    });
};

module.exports = { handleLogin };

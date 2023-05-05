import styled from "styled-components";
import SpotifyWebApi from "spotify-web-api-node";
import noUserImg from "../../assets/hunh.png";
import { useState, useEffect } from "react";

const spotifyAPI = new SpotifyWebApi({
  clientId: "8f847ab9644c45268052c72a398c5262",
});

//Used to display Spotify avatars in various places.
//Uses a question-mark image by default.
//If we're logged in with a token, we can fetch the Spotify avatar for the passed-in user.

const UserImg = ({ userId }) => {
  const accessToken = window.sessionStorage.getItem("accessToken");
  const [imageUrl, setImageUrl] = useState(noUserImg);

  //Grab access token.
  useEffect(() => {
    if (!accessToken) return;
    spotifyAPI.setAccessToken(accessToken);
  }, [accessToken]);

  //Grab Spotify avatar.
  useEffect(() => {
    if (!accessToken) return;
    spotifyAPI
      .getUser(userId)
      .then((res) => {
        if (res.body.images.length > 0) setImageUrl(res.body.images[0].url);
      })
      .catch((err) => console.log(err));
  }, [accessToken]);

  return <ImageArea src={imageUrl} />;
};

const ImageArea = styled.img`
  width: 50px;
  height: 50px;
`;

export default UserImg;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-node";

//The bread and butter for Spotify integration.
//Could definitely use optimizing.
const useAuth = (authCode) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);
  const [status, setStatus] = useState("retrieving");
  const [dbStatus, setdbStatus] = useState("retrieving");
  const [currentUser, setCurrentUser] = useState(null);
  const [userDBInfo, setUserDBInfo] = useState(null);

  const nav = useNavigate();

  const spotifyAPI = new SpotifyWebApi({
    clientId: "8f847ab9644c45268052c72a398c5262",
  });

  //Main login code.
  //1. Check if we have an access token, refresh token, and expiry in storage. If so, grab it and set to state.
  //2. If we're looking for an access token AND we have an auth code ready, fetch a new token with the auth code.
  useEffect(() => {
    if (status != "logged_in") {
      const checkToken = window.sessionStorage.getItem("accessToken");
      const checkRefresh = window.sessionStorage.getItem("refreshToken");
      const checkExpires = window.sessionStorage.getItem("expiresIn");

      if (!accessToken && checkToken) {
        setAccessToken(checkToken);
      }
      if (!refreshToken && checkRefresh) {
        setRefreshToken(checkRefresh);
      }
      if (!expiresIn && checkExpires) {
        setExpiresIn(checkExpires);
      }

      //If we have our token, we're fine.
      if (accessToken) {
        spotifyAPI.setAccessToken(accessToken);

        spotifyAPI
          .getMe()
          .then((res) => setCurrentUser(res.body))
          .then(() => setStatus("logged_in"));
      }

      //If not, we see if we're ready to login.
      //Auth code comes from the Spotify login screen. It sends the code in the redirect address.
      //Since we're redirecting to home right after, the state updates might be redundant.
      //Session storage will give us everything we need.
      else if (authCode && status === "retrieving") {
        fetch("/login", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ authCode }),
        })
          .then((res) => res.json())
          .then((data) => {
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            setExpiresIn(data.expiresIn);

            window.sessionStorage.setItem("accessToken", data.accessToken);
            window.sessionStorage.setItem("refreshToken", data.refreshToken);
            window.sessionStorage.setItem("expiresIn", data.expiresIn);

            setStatus("logged_in");
            nav("/");
          })
          .catch((err) => {
            console.log(err.message);
            setStatus("not_logged_in");
            nav("/");
          });
      } else {
        setStatus("not_logged_in");
      }
    }
  }, [accessToken, authCode, status]);

  //If we have a refresh and an expire, and we get a signal, refresh.
  //TODO: Fix refresh calling rapidly.
  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    if (status === "refresh") {
      fetch("/refresh", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })
        .then((res) => res.json())
        .then((data) => {
          setAccessToken(data.accessToken);
          setExpiresIn(data.expiresIn);

          window.sessionStorage.setItem("accessToken", data.accessToken);
          window.sessionStorage.setItem("expiresIn", data.expiresIn);
          setStatus("retrieving");
        })
        .catch((err) => {
          console.log(err.message);
          setStatus("not_logged_in");
          nav("/");
        });
    }
  }, [refreshToken, expiresIn, status]);

  //Grab user's DB profile
  useEffect(() => {
    if (!currentUser || userDBInfo) return;
    if (dbStatus === "retrieving") {
      fetch(`/profile/${currentUser.id}`)
        .then((res) => res.json())
        .then((resJson) => {
          if (resJson.status === 200) {
            setUserDBInfo(resJson.data);
            setdbStatus("ready");
          }
          //Create the profile if it doesn't exist.
          else if (resJson.status === 404) {
            console.log("No DB profile for user. Creating...");
            fetch("/profile/create", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                spotify_id: currentUser.id,
                name: currentUser.display_name,
              }),
            });

            //Post about the new user registered.
            fetch("/post/create", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                content: `${currentUser.display_name} is here!`,
                type: "newuser",
                author: currentUser.id,
              }),
            });
            setdbStatus("retrieving");
          }
        });
    }
  }, [currentUser, userDBInfo, dbStatus]);

  return { accessToken, status, setStatus, currentUser };
};

export default useAuth;

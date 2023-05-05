import queryString from "query-string";
import ButtonStyle from "./ButtonStyle";

//Setting permissions we need to request from the user.
const scope =
  "playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-read-private user-read-email";

//Directing to the login page.
const loginURL =
  "https://accounts.spotify.com/authorize?" +
  queryString.stringify({
    response_type: "code",
    client_id: "8f847ab9644c45268052c72a398c5262",
    scope,
    redirect_uri: "http://localhost:3300/",
  });

console.log(loginURL);

const LoginButton = () => {
  return (
    <a href={loginURL}>
      <ButtonStyle>Log In</ButtonStyle>
    </a>
  );
};

export default LoginButton;

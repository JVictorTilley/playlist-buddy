import { useNavigate } from "react-router-dom";
import ButtonStyle from "./ButtonStyle";

//Clearing our session storage and booting the user back home.
const LogOutButton = () => {
  const nav = useNavigate();
  return (
    <ButtonStyle
      onClick={() => {
        window.sessionStorage.removeItem("accessToken");
        window.sessionStorage.removeItem("refreshToken");
        window.sessionStorage.removeItem("expiresIn");

        nav("/");
      }}
    >
      Log Out
    </ButtonStyle>
  );
};

export default LogOutButton;

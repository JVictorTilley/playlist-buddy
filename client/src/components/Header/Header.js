import styled from "styled-components";
import LoginButton from "./LoginButton";
import LogOutButton from "./LogoutButton";
import useAuth from "../Hooks/useAuth";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

//Main link area + logging in/out.

const Header = () => {
  const [me, setMe] = useState(null);
  const [headerStatus, setHeaderStatus] = useState("retrieving");
  const authInfo = useAuth();

  useEffect(() => {
    if (authInfo.status === "logged_in") setMe(authInfo.currentUser);
    else setMe(-1);

    if (me) setHeaderStatus("ready");
  }, [authInfo, me]);

  return (
    <Wrapper>
      <Link to="/">
        <TitleText>playlist-buddy</TitleText>
      </Link>
      {headerStatus === "ready" && (
        <>
          <LinkText to="/profile">
            {me.currentUser ? <>{`${me.display_name}'s profile`}</> : "Hello!"}
          </LinkText>
          {window.sessionStorage.getItem("accessToken") ? (
            <LogOutButton />
          ) : (
            <LoginButton />
          )}
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  position: fixed;
  inset: 0px 0px var(--header-offset) 0px;
  background-color: var(--primary-colour);
  padding-left: 30px;
  padding-right: 30px;
`;

const TitleText = styled.h1`
  font-size: calc(20px + 100%);
  font-weight: bold;
  color: white;
`;

const LinkText = styled(Link)`
  font-size: calc(10px + 100%);
  text-decoration: none;
  color: white;
`;

export default Header;

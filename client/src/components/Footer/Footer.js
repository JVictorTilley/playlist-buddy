import styled from "styled-components";
import spotifyWhite from "../../assets/Spotify_Logo_RGB_White.png";

//Footer links to Spotify.
//Using the official Spotify SDK assets. Doing my best to follow style guidelines.
//TODO: Stop the content area from overflowing into the footer.
const Footer = () => {
  return (
    <Wrapper>
      <FooterText>Powered by:</FooterText>
      <SpotifyLink href="https://open.spotify.com/">
        <SpotifyLogoWhite src={spotifyWhite} alt="Spotify" />
      </SpotifyLink>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 30px;
  position: fixed;
  inset: var(--footer-offset) 0px 0px 0px;
  background-color: #116530;
  padding-left: 30px;
  padding-right: 30px;
`;

const FooterText = styled.p`
  font-size: 22px;
  color: white;
`;

const SpotifyLogoWhite = styled.img`
  height: 100%;
`;

const SpotifyLink = styled.a`
  height: 60%;
`;

export default Footer;

import styled from "styled-components";
import useAuth from "./Hooks/useAuth";
import Feed from "./Feed/Feed";
import { useEffect, useState } from "react";
import SongCard from "./SongCard/SongCard";

//Homepage displays the newsfeed.
//Homepage is also the page that delivers the auth code to useAuth.
const HomePage = () => {
  const [recentTracks, setRecentTracks] = useState([]);
  const [trackState, setTrackState] = useState("retrieving");

  const authCode = new URLSearchParams(window.location.search).get("code");
  const { currentUser, accessToken, status } = useAuth(authCode);

  useEffect(() => {
    if (trackState === "retrieving") {
      fetch("/song/recent")
        .then((res) => res.json())
        .then((resJson) => {
          if (resJson.status === 200) {
            console.log(resJson.data);
            setRecentTracks(resJson.data);
            setTrackState("ready");
          } else console.log(resJson.message);
        });
    }
  }, [trackState]);

  return (
    <Wrapper>
      {currentUser && (
        <HomeHeading>Hi, {currentUser.display_name}.</HomeHeading>
      )}
      <HomeHeading>The latest tracks:</HomeHeading>
      <LatestTracksSection>
        {recentTracks.length > 0 ? (
          recentTracks.map((song) => {
            return (
              <SongCard
                key={song._id}
                song={song}
                accessToken={accessToken}
                status={status}
              />
            );
          })
        ) : (
          <h2>Getting tracks...</h2>
        )}
      </LatestTracksSection>

      <HomeHeading>The latest news:</HomeHeading>
      <Feed />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 30px;
  background-color: white;
`;

const LatestTracksSection = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
`;

const HomeHeading = styled.h1`
  font-size: 30px;
  width: 80%;
`;

export default HomePage;

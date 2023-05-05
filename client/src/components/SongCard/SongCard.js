import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import styled from "styled-components";
import SongCardTag from "./SongCardTag";
import { Link } from "react-router-dom";
import UserImg from "../Feed/UserImg";

const spotifyAPI = new SpotifyWebApi({
  clientId: "8f847ab9644c45268052c72a398c5262",
});

//A condensed version of the song page to show on the homepage.
//Similar to the main Song page, but takes MongoDB info in as props.
//Also inherits auth data to reduce redundant API calls.
const SongCard = ({ song, accessToken, status }) => {
  const [spotTrack, setSpotTrack] = useState(null);

  //Set access token.
  useEffect(() => {
    if (!accessToken) return;
    spotifyAPI.setAccessToken(accessToken);
  }, [accessToken, status]);

  //Get track info from Spotify.
  //Send refresh request if token fails.
  useEffect(() => {
    if (!accessToken) return;
    spotifyAPI
      .getTrack(song.spotify_id)
      .then((res) => {
        setSpotTrack(res.body);
      })
      .catch((err) => {
        // setStatus("refresh");
        console.log(err);
      });
  }, [accessToken]);

  return (
    <Wrapper>
      {spotTrack ? (
        <TrackInfo>
          <TrackText>
            <PageLink to={`/song/${song.spotify_id}`}>
              <h1>{spotTrack.name}</h1>
            </PageLink>
            <h3>{spotTrack.artists[0].name}</h3>
            <AlbumName>{spotTrack.album.name}</AlbumName>
            <SpotifyLink href={spotTrack.external_urls.spotify}>
              Open on Spotify
            </SpotifyLink>
            <TagSection>
              {song.tags.length ? (
                song.tags
                  .sort((a, b) => b.score - a.score)
                  .map((tag) => {
                    return (
                      <SongCardTag
                        key={tag.name}
                        tagName={tag.name}
                        tagType={tag.type}
                        tagScore={tag.score}
                        tagId={tag.id}
                      />
                    );
                  })
              ) : (
                <h2>No tags!</h2>
              )}
            </TagSection>

            {song.tags.length > 0 && (
              <>
                <h2>Tagged By:</h2>
                <TaggedBy>
                  {song.tags.map((tag) => {
                    return (
                      <UserLink key={tag.id} to={`/profile/${tag.addedBy}`}>
                        <UserImg userId={tag.addedBy} />
                      </UserLink>
                    );
                  })}
                </TaggedBy>
              </>
            )}
          </TrackText>
        </TrackInfo>
      ) : (
        <h1>Loading Track...</h1>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 500px;
  border: 3px solid var(--primary-colour);
`;

const TrackInfo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  padding: 10px;
`;

const TrackText = styled.div`
  display: flex;
  flex-direction: column;
`;

const AlbumName = styled.h3`
  font-style: italic;
`;

const TagSection = styled.div`
  padding-top: 50px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  border-top: 1px solid var(----background-colour);
  padding: 20px;
`;

const SpotifyLink = styled.a`
  color: var(--primary-colour);
`;

const UserLink = styled(Link)`
  width: 50px;
  height: 50px;
`;

const TaggedBy = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  flex-wrap: wrap;
`;

const PageLink = styled(Link)``;

export default SongCard;

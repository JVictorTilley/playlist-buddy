import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import styled from "styled-components";
import Tag from "../Tag/Tag";
import useAuth from "../Hooks/useAuth";
import { useParams, Link } from "react-router-dom";
import AddTagButton from "./AddTagButton";
import UserImg from "../Feed/UserImg";

const spotifyAPI = new SpotifyWebApi({
  clientId: "8f847ab9644c45268052c72a398c5262",
});

const Song = () => {
  const [spotTrack, setSpotTrack] = useState(null);
  const [mId, setMId] = useState(null);
  const [trackTags, setTrackTags] = useState([]);
  const [tagStatus, setTagStatus] = useState("refresh");
  const { spotId } = useParams();
  const { accessToken, status, currentUser } = useAuth();

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
      .getTrack(spotId)
      .then((res) => {
        setSpotTrack(res.body);
      })
      .catch((err) => {
        // setStatus("refresh");
        console.log(err);
      });
  }, [accessToken]);

  //Songs are linked on the frontend by their Spotify ID.
  //We grab their MongoDB ID to connect to their tags and contributors.
  useEffect(() => {
    fetch(`/song/bySpotifyId/${spotId}`)
      .then((res) => res.json())
      .then(({ data }) => {
        setMId(data._id);
      })
      .catch((err) => console.log("Couldn't get ID: ", err.message));
  }, [spotId]);

  //Get track info from MongoDB.
  useEffect(() => {
    if (mId && tagStatus === "refresh") {
      fetch(`/song/${mId}`)
        .then((res) => res.json())
        .then(({ data }) => {
          setTrackTags(data.tags);
          setTagStatus("active");
        })
        .catch((err) => console.log("Couldn't set tags: ", err.message));
    }
  }, [mId, tagStatus]);

  //Upvoting/Downvoting a tag.
  //TODO: Make users only able to do this once. You can spam votes right now.
  const onTagEdit = (tagId, rating) => {
    const request = {
      tagId,
      rating,
      ratedBy: currentUser.id,
    };
    fetch(`/song/${mId}/changeRating`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setTagStatus("refresh");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Wrapper>
      {spotTrack ? (
        <TrackInfo>
          <AlbumImage
            src={spotTrack.album.images[1].url}
            alt={spotTrack.album.name}
          />
          <TrackText>
            <h1>{spotTrack.name}</h1>
            <h3>{spotTrack.artists[0].name}</h3>
            <AlbumName>
              {spotTrack.album.name}, {spotTrack.album.release_date}
            </AlbumName>
            <SpotifyLink href={spotTrack.external_urls.spotify}>
              Open on Spotify
            </SpotifyLink>
            <TagSection>
              {trackTags.length ? (
                trackTags
                  .sort((a, b) => b.score - a.score)
                  .map((tag) => {
                    return (
                      <Tag
                        key={tag.name}
                        tagName={tag.name}
                        tagType={tag.type}
                        tagScore={tag.score}
                        tagId={tag.id}
                        handler={onTagEdit}
                      />
                    );
                  })
              ) : (
                <h2>No tags! Add some new ones to describe the track!</h2>
              )}
            </TagSection>
            {mId && (
              <AddTagButton
                songId={mId}
                songName={spotTrack.name}
                trackTags={trackTags}
                setTagStatus={setTagStatus}
              />
            )}
            {trackTags.length > 0 && (
              <>
                <h2>Tagged By:</h2>
                <TaggedBy>
                  {trackTags.map((tag) => {
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

const Wrapper = styled.div``;

const TrackInfo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  padding: 30px;
`;

const TrackText = styled.div`
  display: flex;
  flex-direction: column;
`;

const AlbumImage = styled.img`
  width: 300px;
  height: 300px;
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

export default Song;

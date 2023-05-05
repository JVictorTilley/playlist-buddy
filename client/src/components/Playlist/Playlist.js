import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import styled from "styled-components";
import useAuth from "../Hooks/useAuth";
import { useParams, Link } from "react-router-dom";
import AddPlaylist from "./AddPlaylist";

const spotifyAPI = new SpotifyWebApi({
  clientId: "8f847ab9644c45268052c72a398c5262",
});

const Playlist = () => {
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  //Status: Requesting or Ready.
  const [trackStatus, setTrackStatus] = useState("requesting");
  //If any song is missing, needImport will be true.
  const [needImport, setNeedImport] = useState(false);
  const { playlistId } = useParams();
  const { accessToken, status } = useAuth();

  //Set access token.
  useEffect(() => {
    if (!accessToken) return;
    spotifyAPI.setAccessToken(accessToken);
  }, [accessToken, status]);

  //Set playlist.
  useEffect(() => {
    if (!accessToken) return;

    spotifyAPI
      .getPlaylist(playlistId)
      .then((res) => {
        setPlaylist(res.body);
      })
      .catch((err) => {
        // setStatus("refresh");
        console.log(accessToken);
        console.log(err);
      });

    //Playlist info and playlist tracks are two separate calls in Spotify's API.
    spotifyAPI
      .getPlaylistTracks(playlistId)
      .then((res) => {
        setTracks(res.body.items);
      })
      .catch((err) => {
        // setStatus("refresh");
        console.log(accessToken);
        console.log(err);
      });
  }, [accessToken]);

  //Checking which songs are already in the database.
  useEffect(() => {
    const dbCheck = async () => {
      const tracksInDB = await Promise.all(
        tracks.map(async (track) => {
          try {
            const fetchTrack = await fetch(
              `/song/bySpotifyId/${track.track.id}`
            );
            const resJson = await fetchTrack.json();
            if (resJson.status === 200) {
              return { ...track, dbId: resJson.data._id };
            } else if (resJson.status === 404) {
              if (!needImport) setNeedImport(true);
              return { ...track, dbId: null };
            }
          } catch (err) {
            console.log("Could not fetch track from DB: ", err);
          }
        })
      );
      setTracks(tracksInDB);
      if (trackStatus === "requesting") setTrackStatus("ready");
    };

    if (tracks.length && trackStatus === "requesting") dbCheck();
  }, [tracks, trackStatus]);

  return (
    <Wrapper>
      {playlist && tracks ? (
        <PlaylistInfo>
          <PlaylistImage src={playlist.images[0].url} alt={playlist.name} />
          <PlaylistText>
            <h1>{playlist.name}</h1>
            <h3>{playlist.description}</h3>
            <SpotifyLink href={playlist.external_urls.spotify}>
              Open on Spotify
            </SpotifyLink>
            <h2>Tracks:</h2>
            <TrackList>
              {tracks.map((track) => {
                return (
                  <li key={track.track.id}>
                    <TrackInfo dbid={track.dbId} to={`/song/${track.track.id}`}>
                      {track.track.name} - {track.track.artists[0].name}
                    </TrackInfo>
                  </li>
                );
              })}
            </TrackList>
            {needImport && (
              <AddPlaylist tracks={tracks} setTrackStatus={setTrackStatus} />
            )}
          </PlaylistText>
        </PlaylistInfo>
      ) : (
        <h1>Loading Playlist...</h1>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const PlaylistInfo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  padding: 30px;
`;

const PlaylistText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PlaylistImage = styled.img`
  width: 300px;
  height: 300px;
`;

const TrackInfo = styled(Link)`
  color: var(--primary-colour);
  opacity: ${(props) => (props.dbid != null ? "100%" : "50%")};
`;

const TrackList = styled.ol`
  list-style-position: inside;
  color: var(--primary-colour);
`;
const SpotifyLink = styled.a`
  color: var(--primary-colour);
`;

export default Playlist;

import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import styled from "styled-components";
import useAuth from "../Hooks/useAuth";
import { Link, useParams } from "react-router-dom";
import noUserImg from "../../assets/hunh.png";

const spotifyAPI = new SpotifyWebApi({
  clientId: "8f847ab9644c45268052c72a398c5262",
});

const ProfilePage = () => {
  const accessToken = window.sessionStorage.getItem("accessToken");
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [taggedByUser, setTaggedByUser] = useState([]);
  const [profile, setProfile] = useState(null);

  const { profileId } = useParams();
  const { currentUser } = useAuth();

  //Grab access token.
  useEffect(() => {
    if (!accessToken) return;
    spotifyAPI.setAccessToken(accessToken);
  }, [accessToken]);

  //Grab profile from params. (If there's no set profile, grab the logged in user's from UseAuth.)
  useEffect(() => {
    if (!accessToken) return;
    if (profileId) {
      spotifyAPI
        .getUser(profileId)
        .then((res) => {
          setProfile(res.body);
        })
        .catch((err) => console.log(err));
    } else setProfile(currentUser);
  }, [profileId, currentUser, accessToken]);

  //Grab user's playlists.
  useEffect(() => {
    if (!accessToken || !profile) return;
    spotifyAPI.getUserPlaylists(profile.id).then((res) => {
      setUserPlaylists(res.body.items);
    });
  }, [accessToken, currentUser, profile]);

  //Grab user's added tags.
  useEffect(() => {
    if (!profile) return;
    fetch(`/profile/${profile.id}/tagged`)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.status === 200) setTaggedByUser(resJson.data);
        else console.log(resJson.message);
      });
  }, [profile]);

  let imageRef = noUserImg;
  if (profile && profile.images.length > 0) imageRef = profile.images[0].url;

  return (
    <Wrapper>
      {profile ? (
        <ProfileStyle>
          <TextContent>
            <h1>{profile.display_name}</h1>
            <SpotifyLink href={profile.external_urls.spotify}>
              Open on Spotify
            </SpotifyLink>
            <CountryStyle>{profile.country}</CountryStyle>
            <h2>Playlists:</h2>
            {userPlaylists.length && (
              <PlaylistList>
                {userPlaylists.map((playlist) => {
                  return (
                    <li key={playlist.id}>
                      <PlaylistInfo to={`/playlist/${playlist.id}`}>
                        {playlist.name}{" "}
                        <PlaylistAdditional>
                          — {playlist.tracks.total} songs
                        </PlaylistAdditional>
                      </PlaylistInfo>
                    </li>
                  );
                })}
              </PlaylistList>
            )}
            <h2>Tagged Tracks:</h2>
            {taggedByUser.length > 0 ? (
              taggedByUser.map((song) => {
                return (
                  <li key={song._id}>
                    <PlaylistInfo to={`/song/${song.spotify_id}`}>
                      {song.name}
                    </PlaylistInfo>
                  </li>
                );
              })
            ) : (
              <p>No tagged tracks!</p>
            )}
          </TextContent>
          <UserImage src={imageRef} alt={profile.display_name} />
        </ProfileStyle>
      ) : (
        <h1>Loading...</h1>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ProfileStyle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 20px;
  box-shadow: 5px 5px 0px 0px rgba(0, 0, 0, 0.1);
  width: 80%;
  height: 80%;
  padding: 20px;
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const CountryStyle = styled.p`
  font-size: 16px;
  opacity: 75%;
  color: var(--primary-colour);
`;

const PlaylistList = styled.ul`
  list-style-type: "💿 ";
  list-style-position: inside;
`;

const PlaylistInfo = styled(Link)`
  text-decoration: none;
  color: var(--primary-colour);
`;

const PlaylistAdditional = styled.span`
  font-size: 14px;
  opacity: 75%;
`;

const TaggedList = styled.ul`
  list-style-type: "🎵 ";
  list-style-position: inside;
`;

const UserImage = styled.img`
  width: 300px;
  height: 300px;
`;

const SpotifyLink = styled.a`
  color: var(--primary-colour);
  margin-bottom: 20px;
`;

export default ProfilePage;

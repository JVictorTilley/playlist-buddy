import { useEffect } from "react";
import styled from "styled-components";

//Importing playlist tracks to MongoDB.
const handleImport = (tracks, setTrackStatus) => {
  const formattedTracks = tracks.map((track) => {
    console.log(track);
    return {
      spotify_id: track.track.id,
      name: track.track.name,
      artists: track.track.artists.map((artist) => {
        return artist.name;
      }),
      dbId: track.dbId,
    };
  });

  //Only adding tracks which don't have an ID in the database.
  formattedTracks.forEach((track) => {
    console.log(track);
    if (!track.dbId) {
      fetch("/song/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spotify_id: track.spotify_id,
          name: track.name,
          artists: track.artists,
        }),
      })
        .then((res) => res.json())
        .then((resJson) => {
          if (resJson.status === 200) {
            setTrackStatus("requesting");
          } else console.log(resJson.message);
        })
        .catch((err) => console.log(err));
    }
  });
};

const AddPlaylist = ({ tracks, setTrackStatus }) => {
  return (
    <Wrapper onClick={() => handleImport(tracks, setTrackStatus)}>
      Import missing tracks
    </Wrapper>
  );
};

const Wrapper = styled.button`
  background-color: var(--primary-colour);
  width: 150px;
  height: 30px;
  border-radius: 10px;
  color: white;
  font-weight: bold;
`;

export default AddPlaylist;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

//Displaying a tag's info and the list of tracks using it.
const TagPage = () => {
  const [tag, setTag] = useState(null);
  const [songs, setSongs] = useState([]);
  const { tagId } = useParams();

  //Tag info from MongoDB
  useEffect(() => {
    if (tagId) {
      fetch(`/tag/${tagId}`)
        .then((res) => res.json())
        .then(({ data }) => {
          setTag(data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  //Songs which have this tag attached.
  useEffect(() => {
    if (tag) {
      fetch(`/song/byTag/${tagId}`)
        .then((res) => res.json())
        .then(({ data }) => setSongs(data));
    }
  }, [tag]);

  //Lists which users applied this tag to each song.
  const checkRatingUsers = (song) => {
    const currentTag = song.tags.find((t) => t.id === tagId);
    if (currentTag.ratedBy) return currentTag.ratedBy.join(", ");
    else return false;
  };

  return (
    <Wrapper>
      {tag ? (
        <div>
          <h1>{tag.name}</h1>
          <TagType>{tag.type}</TagType>
          <h2>Used By:</h2>
          <ul>
            {songs.map((song) => {
              return (
                <li key={song._id}>
                  {song.name} - {song.artists[0]}{" "}
                  {checkRatingUsers(song) &&
                    ` - Rated By: ${checkRatingUsers(song)}`}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <h1>Loading Tag...</h1>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const TagType = styled.p`
  font-size: 16px;
  opacity: 75%;
  color: var(--primary-colour);
`;

export default TagPage;

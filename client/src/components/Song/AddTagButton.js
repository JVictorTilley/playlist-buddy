import React from "react";
import useAuth from "../Hooks/useAuth";
import styled from "styled-components";
import { useState } from "react";
import { useEffect } from "react";
import TagToAdd from "./TagToAdd";

//Used for adding new tags to a song.
//Currently chosen from a list of predefined tags.
//User-created tags and a search function would be good.
const AddTagButton = ({ songId, trackTags, setTagStatus }) => {
  const [enabled, setEnabled] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const { currentUser } = useAuth();

  //Get a list of all tags.
  useEffect(() => {
    if (!enabled) return;
    fetch("/allTags")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.status === 200) {
          const tagIds = trackTags.map((tag) => tag.id);
          const filteredTags = resJson.data.filter((tag) => {
            return !tagIds.includes(tag._id);
          });
          setAllTags(filteredTags);
        }
      });
  }, [enabled]);

  //Click handler to open/collapse the add tag window.
  const toggleTagSection = () => {
    setEnabled((prev) => !prev);
  };

  const createTagAddedPost = (tagId, songId) => {
    fetch("/post/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `${currentUser.display_name} added a tag!`,
        type: "addedTag",
        author: currentUser.id,
        relatedSong: songId,
        relatedTag: tagId,
      }),
    });
  };

  const onTagAdd = (tagId) => {
    fetch(`/song/${songId}/addTag`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tagId,
        addedBy: currentUser.id,
        ratedBy: currentUser.id,
      }),
    })
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.status === 200) {
          createTagAddedPost(tagId, songId);
          setTagStatus("refresh");
        }
      });
  };

  return (
    <Wrapper>
      <OpenButton onClick={toggleTagSection}>
        {enabled ? "Close" : "Add a new tag!"}
      </OpenButton>
      {enabled && allTags.length > 0 && (
        <TagList>
          {allTags.map((tag) => (
            <TagToAdd
              key={tag.name}
              tagName={tag.name}
              tagType={tag.type}
              tagId={tag._id}
              handler={onTagAdd}
            />
          ))}
        </TagList>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 700px;
  height: 200px;
`;

const OpenButton = styled.button`
  padding: 0px 5px;
  width: fit-content;
  height: 40px;
  color: white;
  background-color: var(--primary-colour);
  border-radius: 10px;
`;

const TagList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export default AddTagButton;

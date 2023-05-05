import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

//The tag bubbles after being attached to the song.
const Tag = ({ tagName, tagType, tagScore, tagId, handler }) => {
  return (
    <Wrapper tagType={tagType}>
      <TagLink to={`/tag/${tagId}`}>
        {tagName} - {tagScore}
      </TagLink>

      <RatingButton
        onClick={() => {
          handler(tagId, 1);
        }}
      >
        +
      </RatingButton>
      <RatingButton
        onClick={() => {
          handler(tagId, -1);
        }}
      >
        -
      </RatingButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  width: fit-content;
  height: 40px;
  padding: 0px 10px;
  background-color: ${(props) => {
    switch (props.tagType) {
      case "vocals":
        return "purple";
      case "instrument":
        return "yellow";
      case "vibe":
        return "pink";
      default:
        return "var(--primary-colour)";
    }
  }};
  border-radius: 25px;

  cursor: pointer;
`;

const TagLink = styled(Link)`
  text-decoration: none;
  color: white;
`;

const RatingButton = styled.button`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  cursor: pointer;
`;

export default Tag;

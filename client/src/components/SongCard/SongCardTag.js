import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

//Condensed tag bubbles. No ratings.
const SongCardTag = ({ tagName, tagType, tagScore, tagId }) => {
  return (
    <Wrapper tagType={tagType}>
      <TagLink to={`/tag/${tagId}`}>
        {tagName} - {tagScore}
      </TagLink>
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
        return "orange";
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

export default SongCardTag;

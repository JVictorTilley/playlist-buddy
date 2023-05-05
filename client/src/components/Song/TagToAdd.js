import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

//Tag bubbles with a button to attach them to the song.
const TagToAdd = ({ tagName, tagType, tagId, handler }) => {
  return (
    <Wrapper tagType={tagType}>
      <TagLink to={`/tag/${tagId}`}>{tagName}</TagLink>

      <AddButton
        onClick={() => {
          handler(tagId);
        }}
      >
        add
      </AddButton>
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
  //There's probably a nicer way to do this than a switch statement.
  //But it works.
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

const AddButton = styled.button`
  width: 30px;
  height: 25px;
  border-radius: 15px;
  cursor: pointer;
`;

export default TagToAdd;

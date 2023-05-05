import React from "react";
import styled from "styled-components";

const InfoPolicy = () => {
  return (
    <Wrapper>
      <HeaderSection>
        playlist-buddy accesses some data from Spotify for its functionality.
      </HeaderSection>
      <h2>We only request and store what we need to bring you our features.</h2>
      <ContentSection>
        <ListHeader>For our users, we store:</ListHeader>
        <ContentList>
          <li>
            The ID of the user's Spotify profile, your playlist-buddy posts, and
            the tags you've created. That's it! Everything else sits exclusively
            on Spotify's servers.
          </li>
        </ContentList>
      </ContentSection>

      <ContentSection>
        <ListHeader>For tracks connected to Spotify, we store:</ListHeader>
        <ContentList>
          <li>Track name;</li>
          <li>Track artist;</li>
          <li>The Spotify track ID. All other info is on Spotify's servers.</li>
          <InfoParagraph>
            We only get this info if a user has imported it through adding a
            playlist. We only use this for identifying tracks.
          </InfoParagraph>
        </ContentList>

        <ListHeader></ListHeader>
      </ContentSection>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HeaderSection = styled.h1`
  width: fit-content;
  font-weight: bold;
  padding-top: 20px;
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 50px;
`;

const ListHeader = styled.h3`
  font-size: 24px;
  font-weight: bold;
`;

const ContentList = styled.ul`
  list-style: "- " inside;
  font-size: 16px;
  color: var(--primary-colour);
`;

const InfoParagraph = styled.p`
  margin-top: 15px;
`;

export default InfoPolicy;

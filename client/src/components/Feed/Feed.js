import React from "react";
import FeedCard from "./FeedCard";
import styled from "styled-components";
import { useEffect, useState } from "react";

//Creates a bunch of "cards" to show updates from other users.
const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [feedStatus, setFeedStatus] = useState("retrieving");

  //Grabbing the full post feed.
  //TODO: More post types, more personalized feed.
  useEffect(() => {
    fetch("/allPosts")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.status === 200) {
          console.log(resJson.data);
          setPosts(resJson.data);
          setFeedStatus("ready");
        }
      });
  }, [feedStatus]);

  return (
    <Wrapper>
      {feedStatus === "ready" ? (
        posts.map((post) => (
          <FeedCard key={post._id} post={post} setFeedStatus={setFeedStatus} />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export default Feed;

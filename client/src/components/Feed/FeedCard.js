import { useState, useEffect } from "react";
import styled from "styled-components";
import Comment from "./Comment";
import useAuth from "../Hooks/useAuth";
import UserImg from "./UserImg";
import WowButton from "./WowButton";

//Shows a post. When the post is modified (rating/comment) we send a reload request.
const FeedCard = ({ post, setFeedStatus }) => {
  const [songs, setSongs] = useState();
  const [tags, setTags] = useState();
  const [songChecked, setSongChecked] = useState(false);
  const [tagChecked, setTagChecked] = useState(false);
  const [postStatus, setPostStatus] = useState("retrieving");
  const { currentUser } = useAuth();

  //Posts store the related metadata (songs, tags etc.) as IDs.
  //Here, we're fetching the proper names for songs.
  useEffect(() => {
    if (postStatus === "ready") return;
    //TODO: Artist pages + DB entry, Playlist DB entry
    //Would only be used for creating posts based on them right now.
    // Returns -1 if it's missing. Posts don't need all metadata.
    const checkSongs = async () => {
      if (post.relatedSong) {
        const songFetch = await fetch(`/song/${[post.relatedSong]}`);
        const songJson = await songFetch.json();
        if (songJson.status === 200) {
          setSongs(songJson.data.name);
        }
      } else setSongs(-1);
      setSongChecked(true);
    };

    if (!songChecked) checkSongs();
  }, [songChecked, postStatus]);

  //Same for tags.
  useEffect(() => {
    const checkTags = async () => {
      if (post.relatedTag) {
        const tagFetch = await fetch(`/tag/${post.relatedTag}`);
        const tagJson = await tagFetch.json();
        if (tagJson.status === 200) setTags(tagJson.data.name);
      } else setTags(-1);
      setTagChecked(true);
    };

    if (!tagChecked && postStatus === "retrieving") checkTags();
  }, [tagChecked, postStatus]);

  //Once we've loaded our metadata, we set "ready" to display.
  useEffect(() => {
    if (songChecked && tagChecked && postStatus === "retrieving")
      setPostStatus("ready");
  }, [postStatus, songChecked, tagChecked]);

  //Comment function to POST the comment and reload.
  const handleSubmit = (formData) => {
    formData.preventDefault();
    const { commentText } = formData.target;
    if (currentUser) {
      fetch(`/post/${post._id}/comment`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: commentText.value,
          author: currentUser.id,
        }),
      })
        .then((res) => res.json())
        .then((resJson) => {
          if (resJson.status === 200) setFeedStatus("retrieving");
          else console.log(resJson);
        });
    }
  };

  return (
    <Wrapper>
      {postStatus === "ready" ? (
        <DataSection>
          <DateString>{post.date}</DateString>
          <MainArea>
            <MainText>
              <UserImg userId={post.author} />
              <PostText>{post.content}</PostText>

              {songs != -1 && <FieldText>{`Song: ${songs}`}</FieldText>}
              {tags != -1 && <FieldText>{`Tag: ${tags}`}</FieldText>}
            </MainText>
            <RatingSection>
              <RatingText>🤩 {post.rating}</RatingText>
              <WowButton postId={post._id} setFeedStatus={setFeedStatus} />
            </RatingSection>
          </MainArea>

          <CommentSection>
            {post.comments.map((comment) => {
              return <Comment key={comment.id} comment={comment} />;
            })}
          </CommentSection>

          <CommentForm name="commentForm" onSubmit={handleSubmit}>
            <CommentField
              name="commentText"
              placeholder="Type a comment!"
            ></CommentField>
            <SubmitButton type="submit" name="submit" value="Add Comment" />
          </CommentForm>
        </DataSection>
      ) : (
        <FieldText>Checking info...</FieldText>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: var(--content-width);
  height: fit-content;
  padding: 20px;
  border: 3px solid var(--background-colour);
  box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.33);
`;

const DateString = styled.p`
  color: gray;
  font-size: 12px;
  opacity: 75%;
  text-align: right;
`;

const PostText = styled.h2`
  font-size: 20px;
`;

const DataSection = styled.div`
  width: 100%;
`;

const MainArea = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MainText = styled.div``;

const RatingSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
`;

const RatingText = styled.p`
  font-size: 20px;
`;

const FieldText = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: gray;
`;

const CommentSection = styled.div`
  border-top: 1px solid var(--primary-colour);
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CommentForm = styled.form`
  margin-top: 10px;
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const CommentField = styled.textarea`
  width: 80%;
  height: 100px;
  font-size: 16px;
`;
const SubmitButton = styled.input`
  background-color: var(--primary-colour);
  width: 100px;
  height: 25px;
  color: white;
  font-size: 12px;
`;

export default FeedCard;

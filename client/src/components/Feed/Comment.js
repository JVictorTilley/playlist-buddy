import styled from "styled-components";
import UserImg from "./UserImg";

//Comments on posts.
const Comment = ({ comment }) => {
  return (
    <Wrapper>
      <TextContent>
        <Author>{comment.author}</Author>
        <DateString>{comment.date}</DateString>
        <ContentArea>{comment.content}</ContentArea>
      </TextContent>
      <UserImg userId={comment.author} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: fit-content;
  border: 1px solid var(--background-colour);
  padding: 10px;
  align-items: center;
  gap: 30px;
`;

const TextContent = styled.div`
  display: flex;
  width: 80%;
  flex-direction: column;
`;

const Author = styled.p`
  font-size: 14px;
`;

const DateString = styled.p`
  color: gray;
  font-size: 12px;
  opacity: 75%;
  text-align: right;
`;

const ContentArea = styled.p`
  color: gray;
  font-size: 18px;
`;

export default Comment;

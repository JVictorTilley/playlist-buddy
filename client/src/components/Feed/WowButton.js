import styled from "styled-components";
import useAuth from "../Hooks/useAuth";

//Liking a post = WOW!
//Generally, status messages on social sites don't have a Dislike button.
const WowButton = ({ postId, setFeedStatus }) => {
  const { currentUser } = useAuth();

  const handleClick = () => {
    fetch(`/post/${postId}/rate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating: 1,
        ratedBy: currentUser.id,
      }),
    })
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.status === 200) setFeedStatus("Retrieving");
        else console.log(resJson.message);
      });
  };

  return <Wrapper onClick={handleClick}>WOW!</Wrapper>;
};

const Wrapper = styled.button`
  height: 75px;
  width: 75px;
  background-color: var(--primary-colour);
  color: white;
  font-weight: bold;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
`;

export default WowButton;

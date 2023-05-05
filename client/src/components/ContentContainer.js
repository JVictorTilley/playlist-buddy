import styled from "styled-components";

//The main content area.
//Should avoid the header/footer.
const ContentContainer = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

const Wrapper = styled.div`
  margin-top: calc(100vh - var(--header-offset));
  height: calc(var(--header-offset) - (100vh - var(--footer-offset)));
  width: 100%;
`;

export default ContentContainer;

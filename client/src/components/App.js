import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import HomePage from "./HomePage";
import GlobalStyle from "../globalStyles";
import ProfilePage from "./ProfilePage/ProfilePage";
import Header from "./Header/Header";
import ContentContainer from "./ContentContainer";
import Footer from "./Footer/Footer";
import Song from "./Song/Song";
import Playlist from "./Playlist/Playlist";
import TagPage from "./Tag/TagPage";
import InfoPolicy from "./InfoPolicy";

const App = () => {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Header />
      <Footer />
      <ContentContainer>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile/:profileId" element={<ProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/song/:spotId" element={<Song />} />
          <Route path="/playlist/:playlistId" element={<Playlist />} />
          <Route path="/tag/:tagId" element={<TagPage />} />
          <Route path="/policy" element={<InfoPolicy />} />
        </Routes>
      </ContentContainer>
    </BrowserRouter>
  );
};

export default App;

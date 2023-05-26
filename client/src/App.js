import { Routes, Route } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Profile from "./pages/profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import QnA from "./pages/QnA";
import ReviewBoard from "./pages/Review";
import Channel from "./components/Channel";
import Search from "./pages/Search";
import QnABoard from "./pages/QnABoard";
import MyReview from "./pages/MyReview";
import ReviewEdit from "./modal/ReviewEdit";
import EditProfile from "./pages/EditProfile";
import MyQnA from "./pages/MyQnA";
import MyLikesReview from "./pages/MyLikesReview";
import QuestionEdit from "./modal/QuestionEdit";
import UserProfile from "./pages/UserProfile";

// reset css 전체 적용
const GlobalStyle = createGlobalStyle`
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}

body {
  &::-webkit-scrollbar {
    display: none;
    // width: 8px;
  }

  /*
  &::-webkit-scrollbar-thumb {
    height: 30%;
    background: #217af4;
    
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(33, 122, 244, .1);
  }
  */
}`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        <Route path="/qna" element={<QnA />} />
        <Route path="/qna/upload" element={<QnA />} />
        <Route path="/qna/:id" element={<QnABoard />} />

        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:id" element={<Channel />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile/myReview" element={<MyReview />} />
        <Route path="/profile/myReview/edit/:id" element={<MyReview />} />
        <Route path="/profile/myQna" element={<MyQnA />} />
        <Route path="/profile/myQna/edit/:id" element={<MyQnA />} />
        <Route path="/profile/myLikes" element={<MyLikesReview />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/profile/:id/:id" element={<UserProfile />} />

        <Route path="/search" element={<Search />} />

        <Route path="/upload" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<ReviewBoard />} />
      </Routes>
    </>
  );
}

export default App;

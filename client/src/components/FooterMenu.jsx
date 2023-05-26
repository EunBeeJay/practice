import { Link } from "react-router-dom";
import styled from "styled-components";

const FooterMenu = () => {
  return (
    <MenuList>
      <Link to="/" style={{ textDecoration: "none", color: "black" }}>
        <div>리뷰</div>
      </Link>
      <Link to="/qna" style={{ textDecoration: "none", color: "black" }}>
        <div>질문</div>
      </Link>
      <Link to="/chat" style={{ textDecoration: "none", color: "black" }}>
        <div>채팅</div>
      </Link>
      <Link to="/profile" style={{ textDecoration: "none", color: "black" }}>
        <div>마이페이지</div>
      </Link>
    </MenuList>
  );
};

export default FooterMenu;

const MenuList = styled.div`
  position: fixed;
  display: flex;
  justify-content: space-around;
  align-items: center;
  bottom: 0;
  width: 100vw;
  height: 50px;
  border-top: 1px solid black;
  background-color: white;
  z-index: 5;
  div {
    font-size: 10px;
  }
`;

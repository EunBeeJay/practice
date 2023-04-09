import styled from "styled-components";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

import HeaderMenu from "../components/HeaderMenu";
import FooterMenu from "../components/FooterMenu";
import { BodyContainer, Section } from "../styles/Style";

const Profile = () => {
  const navigate = useNavigate();
  const onClickLogout = async () => {
    await axios
      .get("http://localhost:4000/user/logout")
      .then(() => navigate("/sign-in"));
  };
  return (
    <BodyContainer>
      <HeaderMenu />
      <Section>
        <Infomation>
          <img src="data:image/jpeg;base64,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" />
          <div>사용자 이름</div>
        </Infomation>
        <Record>
          <div>내 리뷰</div>
          <div>내 QnA</div>
          <div>도움된 리뷰</div>
        </Record>
        <Setting>
          <div>
            <span>고객센터</span>
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
        </Setting>
        <Setting>
          <div onClick={onClickLogout}>
            <span>로그아웃</span>
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
        </Setting>
      </Section>
      <FooterMenu />
    </BodyContainer>
  );
};

export default Profile;

const Infomation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 200px;
  margin-top: 30px;
  background-color: rgba(0, 0, 0, 0.5);
  img {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    object-fit: cover;
  }
  div {
    font-size: 12px;
    margin-top: 10px;
  }
`;

const Record = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 50px;
  background-color: white;
  div {
    font-size: 12px;
    cursor: pointer;
  }
`;

const Setting = styled.div`
  margin-top: -1px;
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50px;
    padding: 10px;
    box-sizing: border-box;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }
  &:hover {
    background-color: rgba(25, 25, 25, 0.2);
  }
`;

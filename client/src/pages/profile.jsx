import styled from "styled-components";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

import HeaderMenu from "../components/HeaderMenu";
import FooterMenu from "../components/FooterMenu";
import { BodyContainer, Section } from "../styles/Style";
import { useEffect } from "react";
import { useState } from "react";

import { ref, getDownloadURL } from "@firebase/storage";
import { storageService } from "../firebase";

const Profile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({});
  const [profileImg, setProfileImg] = useState("");

  useEffect(() => {
    profile();
  }, []);

  const profile = async () => {
    await axios
      .get("http://localhost:4000/profile/", { withCredentials: true })
      .then(async (response) => {
        const {
          data: { user },
        } = response;

        // firebase 에서 이미지 불러오기
        if (user.profileImg) {
          const fileRef = ref(storageService, `${user._id}/${user.profileImg}`);
          const attachmentUrl = await getDownloadURL(fileRef);

          setProfileImg(attachmentUrl);
        }

        setUserProfile(user);
      });
  };

  const onClickLogout = async () => {
    await axios
      .get("http://localhost:4000/user/logout", { withCredentials: true })
      .then(() => navigate("/sign-in"));
  };
  return (
    <BodyContainer>
      <HeaderMenu />
      <Section>
        <Infomation>
          <img
            src={
              profileImg
                ? profileImg
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFagHdfZk7Vzisep4I1UZYuHANzTLHA3ECyw&usqp=CAU"
            }
          />
          <div>{userProfile.nickname}</div>
        </Infomation>
        <Record>
          <Link
            to="/profile/myReview"
            style={{ textDecoration: "none", color: "black" }}
          >
            <div>내 리뷰</div>
          </Link>
          <Link
            to="/profile/myQna"
            style={{ textDecoration: "none", color: "black" }}
          >
            <div>내 QnA</div>
          </Link>
          <Link
            to="/profile/myLikes"
            style={{ textDecoration: "none", color: "black" }}
          >
            <div>도움된 리뷰</div>
          </Link>
        </Record>

        <Setting>
          <Link
            to="/profile/edit"
            state={{ userProfile }}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div>
              <span>프로필 설정</span>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </Link>
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
    font-size: 15px;
    font-weight: bold;
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

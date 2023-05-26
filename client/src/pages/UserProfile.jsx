import styled from "styled-components";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

import HeaderMenu from "../components/HeaderMenu";
import FooterMenu from "../components/FooterMenu";
import { BodyContainer, Section } from "../styles/Style";
import { useEffect } from "react";
import { useState } from "react";

import { ref, getDownloadURL } from "@firebase/storage";
import { storageService } from "../firebase";

import ItemReview from "../components/ItemReview";
import Question from "../components/Question";

const UserProfile = () => {
  const location = useLocation();
  const [userProfile, setUserProfile] = useState({});
  const [profileImg, setProfileImg] = useState("");
  const [userReviews, setUserReviews] = useState([]);
  const [userQuestions, setUserQuestion] = useState([]);
  const [own, setOwn] = useState({});
  const [url, setUrl] = useState("");
  const [likesArr, setLikesArr] = useState([]);
  const [likeReviews, setLikeReviews] = useState([]);

  const userId = location.state;

  useEffect(() => {
    locationUrl();
    profile();
    loadReview();
  }, [location, url]);

  const profile = async () => {
    await axios
      .get("http://localhost:4000/profile/anyUser", {
        params: { userId },
        withCredentials: true,
      })
      .then(async (response) => {
        const {
          data: { user, own },
        } = response;

        // firebase 에서 이미지 불러오기
        if (user.profileImg) {
          const fileRef = ref(storageService, `${user._id}/${user.profileImg}`);
          const attachmentUrl = await getDownloadURL(fileRef);

          setProfileImg(attachmentUrl);
        }

        setUserProfile(user);
        setUserReviews(user.uploadFiles);
        setUserQuestion(user.uploadQuestions);
        setOwn(own);
      });
  };

  /** 좋아요 누른 리뷰 가져오기 */
  const loadReview = async () => {
    await axios
      .get("http://localhost:4000/profile/myLikesReview", {
        withCredentials: true,
      })
      .then((response) => {
        const {
          data: { likesArr, reviewLikes },
        } = response;

        setLikesArr(likesArr);
        setLikeReviews(reviewLikes);
      });
  };

  const locationUrl = () => {
    const urlMenu = location.pathname.split("/")[3];
    setUrl(urlMenu);
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
            to={`/profile/${userProfile.nickname}`}
            state={userProfile._id}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div>리뷰</div>
          </Link>
          <Link
            to={`/profile/${userProfile.nickname}/qna`}
            state={userProfile._id}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div>QnA</div>
          </Link>
          <Link
            to={`/profile/${userProfile.nickname}/like`}
            state={userProfile._id}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div>도움된 리뷰</div>
          </Link>
        </Record>
        <ReviewBox>
          {userReviews.length && url === undefined
            ? userReviews.map((review) => (
                <ItemReview
                  key={review._id}
                  review={review}
                  likes={own.reviewLikes}
                  ownId={own._id}
                />
              ))
            : null}
        </ReviewBox>
        <QuestionList>
          {userQuestions.length && url === "qna"
            ? userQuestions.map((question, idx) => {
                return (
                  <Question key={idx} question={question} ownId={own._id} />
                );
              })
            : null}
        </QuestionList>
        <ReviewBox>
          {likeReviews.length && url === "like"
            ? likeReviews.map((review) => {
                return (
                  <ItemReview
                    key={review._id}
                    review={review}
                    ownId={own._id}
                    likes={likesArr}
                  />
                );
              })
            : null}
        </ReviewBox>
      </Section>
      <FooterMenu />
    </BodyContainer>
  );
};

export default UserProfile;

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

const ReviewBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 50px;
`;

const QuestionList = styled.div`
  margin-top: 50px;
`;

import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { BodyContainer, Section } from "../styles/Style";
import HeaderMenu from "../components/HeaderMenu";
import FooterMenu from "../components/FooterMenu";
import ItemReview from "../components/ItemReview";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

/** 내 리뷰 페이지 */
const MyReview = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [likesArr, setLikesArr] = useState([]);
  const [ownId, setOwnId] = useState("");

  useEffect(() => {
    loadMyReview();
  }, [reviews]);

  const loadMyReview = async () => {
    await axios
      .get("http://localhost:4000/profile/myReview", {
        withCredentials: true,
      })
      .then((response) => {
        const {
          data: { userId, myReviews, reviewLikes },
        } = response;

        setReviews([...myReviews]);
        setLikesArr([...reviewLikes]);
        setOwnId(userId);
      });
  };

  /** 뒤로 가기 */
  const handleBackSpace = () => {
    navigate("/profile");
  };
  return (
    <BodyContainer>
      <Header>
        <div onClick={handleBackSpace}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>내 리뷰</span>
        </div>
      </Header>
      <Section>
        <ReviewBox>
          {reviews.length &&
            reviews.map((review) => {
              return (
                <ItemReview
                  key={review._id}
                  review={review}
                  likes={likesArr}
                  ownId={ownId}
                />
              );
            })}
        </ReviewBox>
      </Section>
      <FooterMenu />
    </BodyContainer>
  );
};

export default MyReview;

const Header = styled.header`
  display: fixed;
  padding: 15px;
  box-sizing: border-box;
  border-bottom: 2px solid #aaaaaa;

  div {
    display: flex;
    gap: 10px;
    cursor: pointer;
  }
`;

const ReviewBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 50px;
`;

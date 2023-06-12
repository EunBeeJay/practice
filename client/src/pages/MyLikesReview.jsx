import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { BodyContainer, Section } from "../styles/Style";
import FooterMenu from "../components/FooterMenu";
import ItemReview from "../components/ItemReview";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const MyLikesReview = () => {
  const navigate = useNavigate();
  const [ownId, setOwnId] = useState("");
  const [reviews, setReviews] = useState([]);
  const [likesArr, setLikesArr] = useState([]);
  useEffect(() => {
    loadReview();
  }, []);

  /** 좋아요 누른 리뷰 가져오기 */
  const loadReview = async () => {
    await axios
      .get("http://localhost:4000/profile/myLikesReview", {
        withCredentials: true,
      })
      .then((response) => {
        const {
          data: { userId, reviewLikes, likesArr },
        } = response;

        setReviews(reviewLikes);
        setOwnId(userId);
        setLikesArr(likesArr);
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
          <span>도움된 리뷰</span>
        </div>
      </Header>
      <Section>
        <ReviewBox>
          {reviews.length
            ? reviews.map((review) => {
                return (
                  <ItemReview
                    key={review._id}
                    review={review}
                    ownId={ownId}
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

export default MyLikesReview;

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

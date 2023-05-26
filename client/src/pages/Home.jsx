import styled from "styled-components";
import axios from "axios";

import HeaderMenu from "../components/HeaderMenu";
import Filter from "../components/Filter";
import ItemReview from "../components/ItemReview";
import ReviewUpload from "../modal/ReviewUpload";
import FooterMenu from "../components/FooterMenu";
import { BodyContainer, Section } from "../styles/Style";

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [likesArr, setLikesArr] = useState([]);
  const [ownId, setOwnId] = useState("");

  useEffect(() => {
    loginValid();
    loadReview();
  }, [reviews]);

  /** 사용자 인증 확인 */
  const loginValid = async () => {
    await axios
      .get("http://localhost:4000/user/loginValid", { withCredentials: true })
      .then(() => setLoggedIn(true))
      .catch(() => navigate("/sign-in"));
  };

  /** 작성된 리뷰 불러오기 */
  const loadReview = async () => {
    await axios
      .get("http://localhost:4000/main", { withCredentials: true })
      .then((response) => {
        const {
          data: { reviews, reviewLikes, userId },
        } = response;

        setLikesArr([...reviewLikes]);
        setReviews([...reviews]);
        setOwnId(userId);
      });
  };
  return (
    <>
      {loggedIn ? (
        <BodyContainer>
          <HeaderMenu />
          <Section>
            <Filter />
            <ReviewBox>
              {reviews.length
                ? reviews.map((review) => (
                    <ItemReview
                      key={review._id}
                      review={review}
                      likes={likesArr}
                      ownId={ownId}
                    />
                  ))
                : null}
            </ReviewBox>
          </Section>
          <ReviewUpload />
          <FooterMenu />
        </BodyContainer>
      ) : null}
    </>
  );
};

export default Home;

const ReviewBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 30px;
  margin-bottom: 50px;
`;

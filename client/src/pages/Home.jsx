import styled from "styled-components";
import axios from "axios";

import HeaderMenu from "../components/HeaderMenu";
import FooterMenu from "../components/FooterMenu";
import ItemReview from "../components/ItemReview";
import { BodyContainer, Section } from "../styles/Style";
import ReviewUpload from "./ReviewUpload";

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [likesArr, setLikesArr] = useState([]);

  useEffect(() => {
    loginValid();
    loadReview();
  }, []);

  /** 사용자 인증 확인 */
  const loginValid = async () => {
    await axios
      .get("http://localhost:4000/user/loginValid", { withCredentials: true })
      .then(() => setLoggedIn(true))
      .catch(() => navigate("/sign-in"));
  };

  const loadReview = async () => {
    await axios
      .get("http://localhost:4000/main", { withCredentials: true })
      .then((response) => {
        const {
          data: { files, likes },
        } = response;

        setLikesArr([...likes]);
        setReviews([...files]);
      });
  };
  return (
    <>
      {loggedIn ? (
        <BodyContainer>
          <HeaderMenu />
          <Section>
            <ReviewBox>
              {reviews.length
                ? reviews.map((review, idx) => (
                    <ItemReview key={idx} review={review} likes={likesArr} />
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
  margin-top: 50px;
  margin-bottom: 50px;
`;

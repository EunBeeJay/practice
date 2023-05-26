import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { BodyContainer, Section } from "../styles/Style";
import HeaderMenu from "../components/HeaderMenu";
import FooterMenu from "../components/FooterMenu";
import ItemReview from "../components/ItemReview";

/** 내 리뷰 페이지 */
const MyReview = () => {
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
  return (
    <BodyContainer>
      <HeaderMenu />
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

const ReviewBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 50px;
  margin-bottom: 50px;
`;

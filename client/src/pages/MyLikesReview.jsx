import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { BodyContainer, Section } from "../styles/Style";
import HeaderMenu from "../components/HeaderMenu";
import FooterMenu from "../components/FooterMenu";
import ItemReview from "../components/ItemReview";

const MyLikesReview = () => {
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

  return (
    <BodyContainer>
      <HeaderMenu />
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

const ReviewBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 50px;
  margin-bottom: 50px;
`;

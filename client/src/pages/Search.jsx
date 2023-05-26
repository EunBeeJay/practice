import styled from "styled-components";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import HeaderMenu from "../components/HeaderMenu";
import FooterMenu from "../components/FooterMenu";
import { BodyContainer, Section } from "../styles/Style";
import Filter from "../components/Filter";
import ItemReview from "../components/ItemReview";

const Search = () => {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const [likesArr, setLikesArr] = useState([]);
  const [ownId, setOwnId] = useState("");

  const [search, setSearch] = useState([]);

  useEffect(() => {
    keywordSearch();
  }, [keyword]);

  const keywordSearch = async () => {
    await axios
      .get("http://localhost:4000/main/search", {
        params: { keyword },
        withCredentials: true,
      })
      .then((response) => {
        const {
          data: { result, user },
        } = response;

        setSearch(result);
        setLikesArr([...user.reviewLikes]);
        setOwnId(user._id);
      })
      .catch((err) => {
        console.log(`검색 에러: ${err}`);
      });
  };

  return (
    <BodyContainer>
      <HeaderMenu />
      <Section>
        <Filter />
        <ReviewBox>
          {search.length
            ? search.map((review, idx) => (
                <ItemReview
                  key={idx}
                  review={review}
                  likes={likesArr}
                  ownId={ownId}
                ></ItemReview>
              ))
            : null}
        </ReviewBox>
      </Section>
      <FooterMenu />
    </BodyContainer>
  );
};

export default Search;

const ReviewBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 30px;
  margin-bottom: 50px;
`;

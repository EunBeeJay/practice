import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Question from "../components/Question";
import { BodyContainer, Section } from "../styles/Style";
import FooterMenu from "../components/FooterMenu";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

/** 내 QnA 페이지 */
const MyQnA = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [ownId, setOwnId] = useState("");

  useEffect(() => {
    loadQnA();
  }, [questions]);

  /** 사용자 인증 확인 */
  const loginValid = async () => {
    await axios
      .get("http://localhost:4000/user/loginValid", { withCredentials: true })
      .then(() => setLoggedIn(true))
      .catch(() => navigate("/sign-in"));
  };

  /** 작성된 내 질문 불러오기 */
  const loadQnA = async () => {
    await axios
      .get("http://localhost:4000/profile/myQna", { withCredentials: true })
      .then((response) => {
        const {
          data: { myQnA, userId },
        } = response;

        setQuestions(myQnA);
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
          <span>내 질문</span>
        </div>
      </Header>
      <Section>
        <QuestionList>
          {questions.map((question) => {
            return (
              <Question key={question._id} question={question} ownId={ownId} />
            );
          })}
        </QuestionList>
      </Section>
      <FooterMenu />
    </BodyContainer>
  );
};

export default MyQnA;

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

const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 50px;
`;

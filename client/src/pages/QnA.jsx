import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import FooterMenu from "../components/FooterMenu";
import HeaderMenu from "../components/HeaderMenu";
import { BodyContainer, Section } from "../styles/Style";
import Question from "../components/Question";
import QuestionUpload from "../modal/QuestionUpload";
import { useEffect } from "react";

const QnA = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [ownId, setOwnId] = useState("");

  useEffect(() => {
    loginValid();
    loadQnA();
  }, [questions]);

  /** 사용자 인증 확인 */
  const loginValid = async () => {
    await axios
      .get("http://localhost:4000/user/loginValid", { withCredentials: true })
      .then(() => setLoggedIn(true))
      .catch(() => navigate("/sign-in"));
  };

  /** 작성된 질문 불러오기 */
  const loadQnA = async () => {
    await axios
      .get("http://localhost:4000/qna", { withCredentials: true })
      .then((response) => {
        const {
          data: { questions, userId },
        } = response;

        setQuestions(questions);
        setOwnId(userId);
      });
  };

  return (
    <>
      {loggedIn ? (
        <BodyContainer>
          <HeaderMenu />
          <Section>
            <QuestionList>
              {questions.map((question, idx) => {
                return <Question key={idx} question={question} ownId={ownId} />;
              })}
            </QuestionList>
          </Section>
          <QuestionUpload />
          <FooterMenu />
        </BodyContainer>
      ) : null}
    </>
  );
};

export default QnA;

const QuestionList = styled.div`
  margin-top: 50px;
`;

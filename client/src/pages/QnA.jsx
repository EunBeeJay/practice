import styled from "styled-components";

import FooterMenu from "../components/FooterMenu";
import HeaderMenu from "../components/HeaderMenu";
import { BodyContainer, Section } from "../styles/Style";
import Question from "../components/Question";
import QuestionUpload from "./QuestionUpload";

const QnA = () => {
  return (
    <BodyContainer>
      <HeaderMenu />
      <Section>
        <QuestionList>
          <Question />
        </QuestionList>
      </Section>
      <QuestionUpload />
      <FooterMenu />
    </BodyContainer>
  );
};

export default QnA;

const QuestionList = styled.div`
  margin-top: 50px;
`;

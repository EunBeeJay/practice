import styled from "styled-components";

const Question = () => {
  return (
    <>
      <QuestionTab>
        <QuestionUser>
          <img src="data:image/jpeg;base64,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" />
          <div>사용자 이름</div>
        </QuestionUser>
        <QuestionDetail>
          <Title>질문 제목</Title>
          <Detail>질문 간략한 내용</Detail>
        </QuestionDetail>
        <QuestionComment>
          <div>답변 0</div>
        </QuestionComment>
      </QuestionTab>
    </>
  );
};

export default Question;

const QuestionTab = styled.div`
  width: 100%;
  height: auto;
  border: 1px solid gray;
  border-radius: 5px;
  background-color: white;
  overflow: hidden;
`;

const QuestionUser = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 10px 0 10px;
  box-sizing: border-box;
  border-bottom: 1px solid gray;
  img {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    object-fit: cover;
  }
  div {
    font-size: 13px;
    margin-left: 5px;
  }
`;

const QuestionDetail = styled.div`
  padding: 20px 10px 0 10px;
  box-sizing: border-box;
`;

const Title = styled.div`
  font-size: 15px;
`;

const Detail = styled.div`
  margin: 10px 0 20px 0;
  font-size: 12px;
  color: gray;
`;

const QuestionComment = styled.div`
  display: flex;
  align-items: center;
  height: 20px;
  padding: 10px;
  margin-top: 10px;
  border-top: 1px solid gray;
  font-size: 12px;
`;

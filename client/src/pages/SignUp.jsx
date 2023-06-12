import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { ErrorMessage } from "../styles/Error";

/** 회원가입 */
const SignUp = () => {
  const scrollRef = useRef([]);
  const navigate = useNavigate();
  // useForm 정의 (useState 함수 대체)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  /** 가로 스크롤 이벤트 */
  useEffect(() => {
    const { current } = scrollRef;

    current.map((el) => {
      if (el) {
        const onWheel = (event) => {
          if (el.deltaY == 0) return;
          el.scrollTo({
            left: el.scrollLeft + event.deltaY,
            behavior: "smooth",
          });
        };
        el.addEventListener("wheel", onWheel);
      }
    });
  });

  /** 공통 키워드 */
  const [commonKeywords, setCommonKeywords] = useState({
    gender: { 남자: false, 여자: false },
    households: {
      "1인 가구": false,
      "2인 가구": false,
      "3인 가구 이상": false,
    },
    age: { "10대": false, "20대": false, "30대": false, "40대 이상": false },
    expending: {
      "한 달 지출 10만원 이하": false,
      "한 달 지출 50만원 이하": false,
      "한 달 지출 100만원 이하": false,
      "한 달 지출 100만원 이상": false,
    },
  });

  const genderArr = Object.entries(commonKeywords.gender);
  const householdsArr = Object.entries(commonKeywords.households);
  const ageArr = Object.entries(commonKeywords.age);
  const expendingArr = Object.entries(commonKeywords.expending);

  /** 공통 키워드 변경 함수 */
  const onChangeCM = (event) => {
    let { gender, households, age, expending } = commonKeywords;

    const {
      target: { name, value },
    } = event;

    switch (name) {
      case "gender":
        Object.keys(gender).forEach((key) => {
          if (key === value) {
            return (gender[key] = true);
          } else {
            return (gender[key] = false);
          }
        });

        setCommonKeywords({ ...commonKeywords, gender });
        break;

      case "households":
        Object.keys(households).forEach((key) => {
          if (key === value) {
            return (households[key] = true);
          } else {
            return (households[key] = false);
          }
        });

        setCommonKeywords({ ...commonKeywords, households });
        break;

      case "age":
        Object.keys(age).forEach((key) => {
          if (key === value) {
            return (age[key] = true);
          } else {
            return (age[key] = false);
          }
        });

        setCommonKeywords({ ...commonKeywords, age });
        break;

      case "expending":
        Object.keys(expending).forEach((key) => {
          if (key === value) {
            return (expending[key] = true);
          } else {
            return (expending[key] = false);
          }
        });

        setCommonKeywords({ ...commonKeywords, expending });
        break;
    }
  };

  // handleSubmit 콜백 함수
  const onValid = async (data) => {
    // 비밀번호 유효성 검사
    if (data.password !== data.passwordCheck) {
      return setError("password", { message: "비밀번호가 일치하지 않습니다." });
    }

    data.common = commonKeywords;

    // 회원가입 정보를 server 에 전달
    await axios
      .post("http://localhost:4000/user/sign-up", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => navigate("/sign-in"))
      .catch((error) => {
        const {
          response: {
            data: { message },
          },
        } = error;

        // 이메일이 중복된 경우
        if (error.request.status === 409) setError("email", { message });
      });
  };

  /** 뒤로가기 */
  const onClickBack = () => {
    navigate("/sign-in");
  };

  return (
    <Container>
      <Header>
        <Back onClick={onClickBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </Back>
      </Header>
      <CenterBox>
        <Title>
          <h1>회원가입</h1>
        </Title>
        <form onSubmit={handleSubmit(onValid)}>
          <Group>
            <Label htmlFor="email">이메일</Label>
            <div>
              <StyleInput
                {...register("email", {
                  required: "* 이메일을 입력해주세요.",
                })}
                id="email"
                type="email"
                placeholder="이메일"
                autoComplete="off"
              />
            </div>
            <ErrorMessage>{errors?.email?.message}</ErrorMessage>
          </Group>
          <Group>
            <Label htmlFor="password">비밀번호</Label>
            <div>
              <StyleInput
                {...register("password", {
                  required: "* 비밀번호를 입력해주세요.",
                })}
                id="password"
                type="password"
                placeholder="비밀번호"
                autoComplete="off"
              />
            </div>
            <ErrorMessage>{errors?.password?.message}</ErrorMessage>
          </Group>
          <Group>
            <Label htmlFor="passwordCheck">비밀번호 확인</Label>
            <div>
              <StyleInput
                {...register("passwordCheck", {
                  required: "* 비밀번호를 입력해주세요.",
                })}
                id="passwordCheck"
                type="password"
                placeholder="비밀번호 확인"
                autoComplete="off"
              />
            </div>
            <ErrorMessage>{errors?.passwordCheck?.message}</ErrorMessage>
          </Group>
          <Group>
            <Label htmlFor="nickname">닉네임</Label>
            <div>
              <StyleInput
                {...register("nickname", {
                  required: "* 닉네임을 입력해주세요.",
                })}
                id="nickname"
                type="text"
                placeholder="닉네임"
                autoComplete="off"
              />
            </div>
            <ErrorMessage>{errors?.nickname?.message}</ErrorMessage>
          </Group>
          <KeywordGroup>
            <KeywordTitle>회원님의 성별 키워드</KeywordTitle>
            <KeywordBox ref={(el) => (scrollRef.current[0] = el)}>
              {genderArr.map((common, idx) => {
                return (
                  <Label key={idx}>
                    <input
                      type="radio"
                      name="gender"
                      value={common[0]}
                      style={{ display: "none" }}
                      {...register("gender", {
                        required: "* 성별을 선택해주세요",
                        onChange: onChangeCM,
                      })}
                    />
                    {common[1] ? (
                      <KeywordBtnTrue>{common[0]}</KeywordBtnTrue>
                    ) : (
                      <KeywordBtnFalse>{common[0]}</KeywordBtnFalse>
                    )}
                  </Label>
                );
              })}
            </KeywordBox>
          </KeywordGroup>
          <KeywordGroup>
            <KeywordTitle>회원님의 거주 인원 키워드</KeywordTitle>
            <KeywordBox ref={(el) => (scrollRef.current[1] = el)}>
              {householdsArr.map((common, idx) => {
                return (
                  <Label key={idx}>
                    <input
                      type="radio"
                      name="households"
                      value={common[0]}
                      style={{ display: "none" }}
                      {...register("households", {
                        required: "* 거주 인원을 선택해주세요",
                        onChange: onChangeCM,
                      })}
                    />
                    {common[1] ? (
                      <KeywordBtnTrue>{common[0]}</KeywordBtnTrue>
                    ) : (
                      <KeywordBtnFalse>{common[0]}</KeywordBtnFalse>
                    )}
                  </Label>
                );
              })}
            </KeywordBox>
          </KeywordGroup>
          <KeywordGroup>
            <KeywordTitle>회원님의 나이 키워드</KeywordTitle>
            <KeywordBox ref={(el) => (scrollRef.current[2] = el)}>
              {ageArr.map((common, idx) => {
                return (
                  <Label key={idx}>
                    <input
                      type="radio"
                      name="age"
                      value={common[0]}
                      style={{ display: "none" }}
                      {...register("age", {
                        required: "* 나이를 선택해주세요",
                        onChange: onChangeCM,
                      })}
                    />
                    {common[1] ? (
                      <KeywordBtnTrue>{common[0]}</KeywordBtnTrue>
                    ) : (
                      <KeywordBtnFalse>{common[0]}</KeywordBtnFalse>
                    )}
                  </Label>
                );
              })}
            </KeywordBox>
          </KeywordGroup>
          <KeywordGroup>
            <KeywordTitle>회원님의 한 달 지출 키워드</KeywordTitle>
            <KeywordBox ref={(el) => (scrollRef.current[3] = el)}>
              {expendingArr.map((common, idx) => {
                return (
                  <Label key={idx}>
                    <input
                      type="radio"
                      name="expending"
                      value={common[0]}
                      style={{ display: "none" }}
                      {...register("expending", {
                        required: "* 한 달 지출을 선택해주세요",
                        onChange: onChangeCM,
                      })}
                    />
                    {common[1] ? (
                      <KeywordBtnTrue>{common[0]}</KeywordBtnTrue>
                    ) : (
                      <KeywordBtnFalse>{common[0]}</KeywordBtnFalse>
                    )}
                  </Label>
                );
              })}
            </KeywordBox>
            <ErrorMessage>{errors?.gender?.message}</ErrorMessage>
          </KeywordGroup>
          <Group>
            <StyleButton type="submit" value="회원가입" />
          </Group>
        </form>
      </CenterBox>
    </Container>
  );
};

export default SignUp;

const Header = styled.header`
  position: fixed;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  background-color: white;
  z-index: 10;

  div {
    &:last-child {
      cursor: pointer;
    }
  }
`;

const Back = styled.div`
  cursor: pointer;
`;

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

const CenterBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Title = styled.header`
  text-align: center;
  h1 {
    font-size: 24px;
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0 20px 0;
`;

const KeywordGroup = styled(Group)`
  display: flex;
  flex-direction: column;
  margin: 10px 0 10px 0;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-size: 12px;
  font-weight: bold;
  animation-name: keybtn-language;
  animation-duration: 0.2s;
`;

const StyleInput = styled.input`
  width: 258px;
  height: 35px;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
  border-width: 0;
  border: 2px solid rebeccapurple;
  border-radius: 5px;
  font-size: 15px;
`;

const StyleButton = styled(StyleInput)`
  width: 258px;
  height: 36px;
`;

const KeywordTitle = styled.div`
  color: black;
  font-size: 12px;
  font-weight: bold;
  animation-name: keybtn-language;
  animation-duration: 0.2s;
`;

const KeywordBox = styled.div`
  display: flex;
  gap: 10px;
  max-width: 258px;
  padding: 10px 0;
  box-sizing: border-box;
  overflow: auto;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const KeywordBtnFalse = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3px 20px;
  box-sizing: border-box;
  border: 1px solid black;
  border-radius: 5px;
  background-color: #eee;
  color: #333333;
  font-weight: bold;
  animation-name: keybtn-language;
  animation-duration: 0.2s;
  cursor: pointer;

  &:active {
    box-shadow: inset -0.3rem -0.1rem 1.4rem #fbfbfb,
      inset 0.3rem 0.4rem 0.8rem #bec5d0;
    color: #fc7174;
  }

  /*
  background-color: #eee;
  box-shadow: 1px 2px 0 rgb(0, 0, 0, 0.5);
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }

  &:active {
    position: relative;
    top: 2px;
    box-shadow: 1px 1px 0 rgb(0, 0, 0, 0.5);
    color: #fc7174;
  }
  */
`;

const KeywordBtnTrue = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3px 20px;
  box-sizing: border-box;
  border: 1px solid black;
  border-radius: 5px;
  background-color: #eee;
  box-shadow: inset -0.3rem -0.1rem 1.4rem #fbfbfb,
    inset 0.3rem 0.4rem 0.8rem #bec5d0;
  color: #fc7174;
  font-weight: bold;
  animation-name: keybtn-language;
  animation-duration: 0.2s;
  cursor: pointer;
`;

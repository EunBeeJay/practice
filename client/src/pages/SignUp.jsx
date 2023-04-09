import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import { ErrorMessage } from "../styles/Error";

/** 회원가입 */
const SignUp = () => {
  const navigate = useNavigate();
  // useForm 정의 (useState 함수 대체)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  // handleSubmit 콜백 함수
  const onValid = async (data) => {
    // 비밀번호 유효성 검사
    if (data.password !== data.passwordCheck) {
      return setError("password", { message: "비밀번호가 일치하지 않습니다." });
    }

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

  return (
    <Container>
      <CenterBox>
        <Header>
          <h1>회원가입</h1>
        </Header>
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
          <Group>
            <StyleButton type="submit" value="회원가입" />
          </Group>
        </form>
      </CenterBox>
    </Container>
  );
};

export default SignUp;

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

const CenterBox = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Header = styled.header`
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

const Label = styled.label`
  font-size: 13px;
  margin-bottom: 5px;
`;

const StyleInput = styled.input`
  width: 250px;
  height: 30px;
`;

const StyleButton = styled(StyleInput)`
  width: 258px;
  height: 36px;
`;

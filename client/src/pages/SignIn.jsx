import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { ErrorMessage } from "../styles/Error";

const SignIn = () => {
  const navigate = useNavigate();
  // useForm 정의
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  // handleSubmit 콜백 함수
  const onValid = async (data) => {
    await axios
      .post(
        "http://localhost:4000/user/sign-in",
        data,
        { withCredentials: true },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then(() => navigate("/"))
      .catch((error) => {
        const {
          response: {
            data: { type, message },
          },
        } = error;

        setError(type, { message });
      });
  };
  return (
    <>
      <LoginContainer>
        <CenterBox>
          <Header>
            <h1>로그인</h1>
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
              <StyleButton type="submit" value="로그인" />
            </Group>
            <Group>
              <Link to="/sign-up">
                <StyleButton type="submit" value="회원가입" />
              </Link>
            </Group>
          </form>
        </CenterBox>
      </LoginContainer>
    </>
  );
};

export default SignIn;

// style 적용
const LoginContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

const CenterBox = styled.div`
  position: absolute;
  top: 33%;
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

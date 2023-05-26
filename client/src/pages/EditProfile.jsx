import styled from "styled-components";
import axios from "axios";
import { useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import FooterMenu from "../components/FooterMenu";
import { BodyContainer, Section } from "../styles/Style";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ErrorMessage } from "../styles/Error";

import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { storageService } from "../firebase";

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm();
  const [pwEdit, setPwEdit] = useState(false);
  const [profileImg, setProfileImg] = useState("");
  const [changeImage, setChangeImage] = useState(false);

  // 유저 프로필 정보
  const { userProfile } = location.state;

  useEffect(() => {
    loadProfileImg();
  }, []);

  // firebase 에서 이미지 불러오기
  const loadProfileImg = async () => {
    if (userProfile.profileImg) {
      const fileRef = ref(
        storageService,
        `${userProfile._id}/${userProfile.profileImg}`
      );
      const attachmentUrl = await getDownloadURL(fileRef);

      setProfileImg(attachmentUrl);
    }
  };

  const onValid = async (data) => {
    const imgId = new Date().getTime().toString(36);

    if (!pwEdit) {
      delete data.password;
      delete data.passwordCheck;
    }

    // 사진 변경 함수가 실행되면
    if (changeImage) {
      data.profileImg = imgId;
    }

    await axios
      .post("http://localhost:4000/profile/edit", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async () => {
        if (changeImage) {
          const fileRef = ref(storageService, `${userProfile._id}/${imgId}`);
          await uploadString(fileRef, profileImg, "data_url");
        }

        navigate("/profile");
      })
      .catch((err) => console.log(`프로필 설정 client ${err}`));
  };

  /** 뒤로 가기 */
  const handleBackSpace = () => {
    navigate("/profile");
  };

  /** 비밀번호 수정 클릭 시 비밀번호 수정 입력란 생성 */
  const handlePwEdit = () => {
    setPwEdit((prev) => !prev);
  };

  /** 이미지 업로드 미리보기 */
  const handlePreview = (event) => {
    const { files } = event.target;

    let fileUrls = [];

    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();
      reader.onload = async () => {
        /*
        // base64 긴 url 줄이기
        const url = await fetch(reader.result)
          .then((response) => response.blob())
          .then((blob) => URL.createObjectURL(blob));
          */

        fileUrls = reader.result;
        setProfileImg(fileUrls);
      };
      reader.readAsDataURL(files[i]);
    }

    setChangeImage(true);
  };

  return (
    <BodyContainer>
      <Header>
        <div onClick={handleBackSpace}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>프로필 수정</span>
        </div>
      </Header>
      <Section>
        <form onSubmit={handleSubmit(onValid)}>
          <Group>
            <Label>
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handlePreview}
              />
              <img
                src={
                  profileImg
                    ? profileImg
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFagHdfZk7Vzisep4I1UZYuHANzTLHA3ECyw&usqp=CAU"
                }
              />
            </Label>
          </Group>
          <Group>
            <Title>
              <label htmlFor="nickname">닉네임</label>
            </Title>
            <Input
              id="nickname"
              type="text"
              {...register("nickname", {
                required: "* 닉네임을 입력해주세요.",
              })}
              defaultValue={userProfile.nickname}
            />
            <ErrorMessage>{errors?.nickname?.message}</ErrorMessage>
          </Group>
          <Group>
            <Title>
              <label htmlFor="email">이메일</label>
            </Title>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "* 이메일을 입력해주세요.",
              })}
              defaultValue={userProfile.email}
            />
            <ErrorMessage>{errors?.email?.message}</ErrorMessage>
          </Group>
          <PasswordToggle>
            <label htmlFor="password">비밀번호</label>
            <span onClick={handlePwEdit}>수정</span>
          </PasswordToggle>
          {pwEdit ? (
            <>
              <PwGroup>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "* 비밀번호를 입력해주세요.",
                  })}
                />
              </PwGroup>
              <Group>
                <Title>
                  <label htmlFor="passwordCheck">비밀번호 확인</label>
                </Title>
                <Input
                  id="passwordCheck"
                  type="password"
                  {...register("passwordCheck", {
                    required: "* 비밀번호를 입력해주세요.",
                    validate: (value) => {
                      if (watch("password") !== value) {
                        return "* 비밀번호가 일치하지 않습니다.";
                      }
                    },
                  })}
                />
                <ErrorMessage>
                  {errors?.password?.message || errors?.passwordCheck?.message}
                </ErrorMessage>
              </Group>
            </>
          ) : null}
          <Group>
            <Button>수정하기</Button>
          </Group>
        </form>
      </Section>
      <FooterMenu />
    </BodyContainer>
  );
};

export default EditProfile;

const Header = styled.header`
  display: fixed;
  padding: 15px;
  box-sizing: border-box;

  div {
    display: flex;
    gap: 10px;
    cursor: pointer;
  }
`;

const PasswordToggle = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;

  span {
    color: red;
    cursor: pointer;
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0 20px 0;
`;

const Label = styled.label`
  display: flex;
  justify-content: center;

  img {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    object-fit: cover;
    cursor: pointer;

    &:hover {
      filter: brightness(0.8);
    }
  }
`;

const PwGroup = styled(Group)`
  margin: 0;
  margin-top: 5px;
`;

const Title = styled.h1`
  margin-bottom: 5px;
  font-size: 13px;
`;

const Input = styled.input`
  width: 100%;
  height: 35px;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
  border-width: 0;
  border: 2px solid rebeccapurple;
  border-radius: 5px;
  font-size: 15px;
`;

const Button = styled.button`
  height: 35px;
`;

import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";

import { ref, getDownloadURL } from "@firebase/storage";
import { storageService } from "../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import QuestionEdit from "../modal/QuestionEdit";

const Question = ({ question, ownId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileImg, setProfileImg] = useState("");
  // 수정 및 삭제 버튼 나타내기
  const [editButton, setEditButton] = useState(false);

  useEffect(() => {
    handleEditButton();
    loadUser();
  }, []);

  const handleEditButton = () => {
    const { pathname } = location;

    if (pathname === "/profile/myQna") {
      setEditButton(true);
    }
  };

  /** 유저 프로필 사진 가져오기 */
  const loadUser = async () => {
    const { userId } = question;

    await axios
      .get("http://localhost:4000/qna/user", {
        params: { userId },
        withCredentials: true,
      })
      .then(async (response) => {
        const {
          data: { user },
        } = response;

        if (user.profileImg) {
          const fileRef = ref(storageService, `${user._id}/${user.profileImg}`);
          const attachmentUrl = await getDownloadURL(fileRef);

          setProfileImg(attachmentUrl);
        }
      });
  };

  /** QnA 상세보기 */
  const onBoardDetail = (question) => {
    const { pathname } = location;

    if (pathname === "/qna" || pathname === "/profile/myQna") {
      const { questionId } = question;
      navigate(`/qna/${questionId}`, { state: { question, profileImg } });
    }
  };

  /** 대화하기 클릭 시 채팅방 입장 */
  const EnterChatRoom = async () => {
    const { userId } = question;
    await axios
      .get("http://localhost:4000/chat/room", {
        params: { othersId: userId },
        withCredentials: true,
      })
      .then((response) => {
        const {
          data: { roomId },
        } = response;

        navigate(`chat/${roomId}`, {
          state: { roomId, profileImg },
        });
      });
  };

  /** 유저 프로필 이동 */
  const userProfile = () => {
    if (ownId === question.userId) {
      navigate(`/profile`, { state: question.userId });
    } else {
      navigate(`/profile/${question.userId}`, { state: question.userId });
    }
  };

  /** 질문 수정 */
  const handleEdit = () => {
    const { questionId } = question;
    navigate(`/profile/myQna/edit/${questionId}`, { state: { edit: true } });
  };

  /** 질문 삭제 */
  const handleDelete = async () => {
    const { _id } = question;

    await axios.get("http://localhost:4000/main/delete", {
      params: { questionId: _id },
      withCredentials: true,
    });
  };

  return (
    <>
      <AnimatePresence>
        <QuestionTab>
          <QuestionUser>
            <User>
              <Name onClick={userProfile}>
                <img
                  src={
                    profileImg
                      ? profileImg
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFagHdfZk7Vzisep4I1UZYuHANzTLHA3ECyw&usqp=CAU"
                  }
                />
                <div>{question.nickname}</div>
              </Name>
              {question.userId !== ownId ? (
                <ChatLink onClick={EnterChatRoom}>대화하기</ChatLink>
              ) : null}
              {editButton && (
                <Edit>
                  <div onClick={handleEdit}>수정</div>
                  <div onClick={handleDelete}>삭제</div>
                </Edit>
              )}
            </User>
          </QuestionUser>
          <QuestionDetail onClick={() => onBoardDetail(question)}>
            <Title>{question.title}</Title>
            <Detail>{question.detail}</Detail>
            <Keywords>
              {question.keywords.map((keyword, idx) => {
                return <KeywordBtn key={idx}>{keyword}</KeywordBtn>;
              })}
            </Keywords>
          </QuestionDetail>
          <QuestionComment>
            <div>답변 {question.comments.length}</div>
          </QuestionComment>
        </QuestionTab>
      </AnimatePresence>
      <AnimatePresence>
        <QuestionEdit question={question} />
      </AnimatePresence>
    </>
  );
};

export default Question;

const QuestionTab = styled.div`
  width: 100%;
  height: auto;
  margin-bottom: 15px;
  border: 1px solid gray;
  border-radius: 5px;
  background-color: white;
  overflow: hidden;
`;

const QuestionUser = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding-right: 15px;
  box-sizing: border-box;
  border-bottom: 1px solid gray;
  background-color: #909fc8;

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

const User = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;

  img {
    width: 30px;
    height: 30px;
    margin-right: 5px;
    border-radius: 15px;
    object-fit: cover;
  }
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ChatLink = styled.div`
  padding: 5px;
  box-sizing: border-box;
  border: 1px solid gray;
  border-radius: 5px;
  background-color: white;
  font-size: 15px;
  cursor: pointer;

  &:hover {
    filter: brightness(0.9);
  }

  &:active {
    filter: brightness(0.7);
  }
`;

const Edit = styled.div`
  display: flex;

  div {
    cursor: pointer;
    padding: 3px;

    &:first-child {
      font-size: 15px;
      font-weight: bold;
      font-family: Arial, Helvetica, sans-serif;
      color: #0044ff;
    }

    &:last-child {
      font-size: 15px;
      font-weight: bold;
      font-family: Arial, Helvetica, sans-serif;
      color: #e31c1c;
    }
  }

  /*
  div {
    padding: 5px;
    box-sizing: border-box;
    border: 1px solid gray;
    border-radius: 5px;
    background-color: white;
    font-size: 15px;
    cursor: pointer;

    &:hover {
      filter: brightness(0.9);
    }

    &:active {
      filter: brightness(0.7);
    }
  }
  */
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

const Keywords = styled.div``;

const KeywordBtn = styled.button`
  border-radius: 15px;
  border-color: gray;
  color: #5ba4e7;
  font-weight: bold;
  border: 1px solid gray;
  background-color: #fffaf4;
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

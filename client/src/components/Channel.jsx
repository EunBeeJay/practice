import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import "firebase/compat/app";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { dbService } from "../firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowLeft,
  faEllipsisVertical,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Section } from "../styles/Style";

const Channel = () => {
  const buttonRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [chat, setChat] = useState("");
  const [chatList, setChatList] = useState([]);
  const [uid, setUid] = useState("");
  const [channel, setChannel] = useState({});

  // navigate 로 전달받은 파라미터 추출
  const {
    state: { roomId, profileImg },
    pathname,
  } = location;

  // 채팅 내용 불러오기 및 실시간 렌더링
  useEffect(() => {
    handleChannel();

    const q = query(collection(dbService, roomId), orderBy("createdAt"));
    onSnapshot(q, (snapshot) => {
      const chatArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatList(chatArr);
    });
  }, []);

  const handleChannel = async () => {
    await axios
      .get("http://localhost:4000/chat/channel", {
        withCredentials: true,
        params: { pathname },
      })
      .then(async (response) => {
        const {
          data: { userId, chat },
        } = response;

        setUid(userId);
        setChannel(chat);
      });
  };

  /** firebase 저장 및 실시간 렌더링 */
  const onValid = async () => {
    // 유저의 고유 id 값 불러오기

    try {
      // 날짜 구하기
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const date = new Date().getDate();

      // 시간 구하기
      const hours = new Date().getHours();
      const minutes = new Date().getMinutes();

      // 현재 날짜
      const today = `${year}-${month < 10 ? `0${month}` : month}-${
        date < 10 ? `0${date}` : date
      }`;

      // 현재 시간
      const time = `${hours < 10 ? `0${hours}` : hours}:${
        minutes < 10 ? `0${minutes}` : minutes
      }`;

      const docRef = await addDoc(collection(dbService, roomId), {
        uid,
        text: chat,
        createdAt: new Date(),
        today: today,
        time: time,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    setChat("");
  };

  /** 채팅 내용 실시간 변경 */
  const chatValue = (event) => {
    const {
      target: { value },
    } = event;
    setChat(value);

    event.target.style.height = "25px";
    event.target.style.height = event.target.scrollHeight + "px";
  };

  /** 쉬프트 누르지 않고 엔터 키 입력 시 전송 */
  const handleEnterKey = (event) => {
    if (event.keyCode === 13) {
      if (!event.shiftKey) {
        buttonRef.current.click();
      }
    }
  };

  /** 뒤로가기 */
  const onClickBack = () => {
    navigate("/chat");
  };

  /** 채팅방 나가기 */
  const onExitChat = async () => {
    await axios
      .get("http://localhost:4000/chat/exit", {
        withCredentials: true,
        params: { roomId },
      })
      .then(() => {
        navigate("/chat");
      });
  };
  return (
    <div>
      <Header>
        <Back onClick={onClickBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </Back>
        <div>채팅</div>
        <div onClick={onExitChat}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
        </div>
      </Header>
      <Section>
        <ChatingBox>
          {chatList.map((chat) => (
            <ContentBox key={chat.id}>
              {uid !== chat.uid ? (
                <>
                  <img
                    src={
                      profileImg
                        ? profileImg
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFagHdfZk7Vzisep4I1UZYuHANzTLHA3ECyw&usqp=CAU"
                    }
                  />
                  <Content>
                    <div>
                      {channel.activate
                        ? String(channel.maker) === String(uid)
                          ? channel.user_2.nickname
                          : channel.user_1.nickname
                        : "알 수 없음"}
                    </div>
                    <div>{chat.text}</div>
                  </Content>
                  <Time>{chat.time}</Time>
                </>
              ) : (
                <MineContent>
                  <Time>{chat.time}</Time>
                  <Content>
                    <div style={{ backgroundColor: "#ffd062" }}>
                      {chat.text}
                    </div>
                  </Content>
                </MineContent>
              )}
            </ContentBox>
          ))}
        </ChatingBox>
      </Section>
      <form onSubmit={handleSubmit(onValid)}>
        {channel.activate ? (
          <Chat>
            <div>
              <FontAwesomeIcon icon={faPlus} size="lg" />
            </div>
            <textarea
              {...register("content", {
                onChange: chatValue,
                required: true,
              })}
              value={chat}
              rows={1}
              placeholder="what's your mind?"
              onKeyDown={handleEnterKey}
            />
            <Button ref={buttonRef}>보내기</Button>
          </Chat>
        ) : (
          <NotChat>
            <div>
              <FontAwesomeIcon icon={faPlus} size="lg" />
            </div>
            <textarea
              {...register("content", {
                onChange: chatValue,
                required: true,
              })}
              value={chat}
              rows={1}
              placeholder="보낼 수 없습니다."
              onKeyDown={handleEnterKey}
              readOnly
            />
            <NotButton ref={buttonRef}>보내기</NotButton>
          </NotChat>
        )}
      </form>
    </div>
  );
};

export default Channel;

const Header = styled.header`
  position: fixed;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  border-bottom: 1px solid gray;
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

const ChatingBox = styled.div`
  margin-top: 40px;
  margin-bottom: 40px;
`;

const ContentBox = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  padding: 10px;
  box-sizing: border-box;

  img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }
`;

const Content = styled.div`
  font-family: Arial, Helvetica, sans-serif;
  div {
    &:first-child {
      font-size: 13px;
    }

    &:last-child {
      max-width: 60vw;
      margin-top: 5px;
      padding: 10px 5px;
      box-sizing: border-box;
      border-radius: 5px;
      font-size: 14px;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
`;

const MineContent = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  gap: 10px;
  font-family: Arial, Helvetica, sans-serif;
`;

const Time = styled.div`
  display: flex;
  align-items: flex-end;
  width: max-content;
  font-size: 10px;
`;

const Chat = styled.div`
  position: fixed;
  display: flex;
  width: 100%;
  height: 50px;
  bottom: 0;
  gap: 10px;
  padding: 10px;
  box-sizing: border-box;
  border-top: 1px solid gray;
  background-color: white;

  div {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  textarea {
    width: 100%;
    height: 25px;
    max-height: 79px;
    line-height: 25px;
    font-size: 15px;
    border: none;
    resize: none;

    &:focus {
      outline: none;
    }

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #2f3542;
      border-radius: 10px;
      background-clip: padding-box;
      border: 2px solid transparent;
    }
  }
`;

const Button = styled.button`
  width: 40px;
  min-width: 40px;
  height: 25px;
  padding: 0;
  border: none;
  background-color: white;
  color: blue;
  font-weight: bold;
  cursor: pointer;
`;

const NotChat = styled(Chat)`
  cursor: not-allowed;
  filter: brightness(0.8);

  div {
    cursor: not-allowed;
  }
  textarea {
    cursor: not-allowed;
  }
`;

const NotButton = styled(Button)`
  cursor: not-allowed;
`;

import styled from "styled-components";

import HeaderMenu from "../components/HeaderMenu";
import FooterMenu from "../components/FooterMenu";
import { BodyContainer } from "../styles/Style";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "firebase/compat/app";
import {
  collection,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { dbService } from "../firebase";

const Chat = () => {
  const navigate = useNavigate();
  const [chatList, setChatList] = useState([]);
  const [lastChat, setLastChat] = useState([]);
  const [ownId, setOwnId] = useState();

  useEffect(() => {
    loadChatList();
  }, []);

  // 채팅 상대방 목록 가져오기
  const loadChatList = async () => {
    await axios
      .get("http://localhost:4000/chat", { withCredentials: true })
      .then((response) => {
        const {
          data: { chatingRooms, userId },
        } = response;

        // 맨 마지막 대화내역 가져오기
        chatingRooms.map((chat) => {
          const q = query(
            collection(dbService, chat._id),
            orderBy("createdAt"),
            limitToLast(1)
          );
          onSnapshot(q, (snapshot) => {
            if (snapshot.docs) {
              const chatArr = snapshot.docs.map((doc) => {
                return { ...doc.data() };
              });
              setLastChat((lastChat) => [...lastChat, ...chatArr]);
            }
          });
        });

        setChatList([...chatingRooms]);
        setOwnId(userId);
      });
  };

  // 채팅 리스트 클릭 시 채팅방으로 이동
  const onClickChatRoom = (roomId, chat) => {
    if (chat.maker === ownId) {
      navigate(`/chat/${roomId}`, {
        state: { roomId, profileImg: chat.user_1.profileImg },
      });
    } else {
      navigate(`/chat/${roomId}`, {
        state: { roomId, profileImg: chat.user_2.profileImg },
      });
    }
  };

  return (
    <BodyContainer>
      <HeaderMenu />
      <ChatList>
        {chatList.map((chat, idx) => {
          {
            return chat.activate ? (
              <ChatRoom
                key={chat._id}
                onClick={() => onClickChatRoom(chat._id, chat)}
              >
                <img
                  src={
                    ownId === chat.maker
                      ? chat.user_2.profileImg
                        ? chat.user_2.profileImg
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFagHdfZk7Vzisep4I1UZYuHANzTLHA3ECyw&usqp=CAU"
                      : chat.user_1.profileImg
                      ? chat.user_1.profileImg
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFagHdfZk7Vzisep4I1UZYuHANzTLHA3ECyw&usqp=CAU"
                  }
                />
                <ChatInfo>
                  <div>
                    <span>
                      {String(ownId) === String(chat.maker)
                        ? chat.user_2.nickname
                        : chat.user_1.nickname}
                    </span>
                    <span>{lastChat.length ? lastChat[idx]?.today : null}</span>
                  </div>
                  <div>{lastChat.length ? lastChat[idx]?.text : null}</div>
                </ChatInfo>
              </ChatRoom>
            ) : (
              <ChatRoom
                key={chat._id}
                onClick={() => onClickChatRoom(chat._id, chat)}
              >
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFagHdfZk7Vzisep4I1UZYuHANzTLHA3ECyw&usqp=CAU" />
                <ChatInfo>
                  <div>
                    <span>알 수 없음</span>
                    <span>{lastChat.length ? lastChat[idx]?.today : null}</span>
                  </div>
                  <div>{lastChat.length ? lastChat[idx]?.text : null}</div>
                </ChatInfo>
              </ChatRoom>
            );
          }
        })}
      </ChatList>
      <FooterMenu />
    </BodyContainer>
  );
};

export default Chat;

const ChatList = styled.div`
  padding-top: 47px;
`;

const ChatRoom = styled.div`
  display: flex;
  align-items: center;
  height: 70px;
  padding: 0 5px 0 5px;
  cursor: pointer;
  img {
    width: 50px;
    min-width: 50px;
    height: 50px;
    min-height: 50px;
    border-radius: 25px;
  }
  &:hover {
    background-color: rgba(25, 25, 25, 0.2);
  }
`;

const ChatInfo = styled.div`
  margin-left: 10px;
  font-size: 12px;
  width: 100vw;
  div {
    &:first-child {
      display: flex;
      justify-content: space-between;
    }
    &:last-child {
      margin-top: 5px;
      color: gray;
    }
  }
`;

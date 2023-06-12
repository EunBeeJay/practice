import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import FooterMenu from "../components/FooterMenu";
import HeaderMenu from "../components/HeaderMenu";
import Question from "../components/Question";
import { BodyContainer, Section } from "../styles/Style";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { ref, getDownloadURL } from "@firebase/storage";
import { storageService } from "../firebase";
import { useRef } from "react";

/** QnA 페이지 상세 보기 */
const QnABoard = () => {
  const navigate = useNavigate();
  const replyRef = useRef([]);
  const commentRef = useRef([]);
  const location = useLocation();
  const {
    state: { question, profileImg },
  } = location;
  const { register, handleSubmit } = useForm();

  const [comments, setComments] = useState([...question.comments]);
  const [commentValue, setCommentValue] = useState("");
  const [ownProfileImg, setOwnProfileImg] = useState("");
  const [owner, setOwner] = useState({});
  const [replyValue, setReplyValue] = useState("");
  const [replyIdx, setReplyIdx] = useState(-1);

  useEffect(() => {
    loadUser();
  }, []);

  /** 나의 프로필 이미지 */
  const loadUser = async () => {
    await axios
      .get("http://localhost:4000/main/user", {
        withCredentials: true,
      })
      .then(async (response) => {
        const {
          data: { user },
        } = response;

        // firebase 에서 이미지 불러오기
        if (user.profileImg) {
          const fileRef = ref(storageService, `${user._id}/${user.profileImg}`);
          const attachmentUrl = await getDownloadURL(fileRef);

          setOwnProfileImg(attachmentUrl);
        }

        setOwner(user);
      });
  };

  /** 댓글 전송 */
  const onValid_1 = async (data) => {
    const { _id } = question;
    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();

    const hours = today.getHours();
    const minutes = today.getMinutes();

    // 현재 날짜
    const createdAt = `${year}-${month < 10 ? `0${month}` : month}-${
      date < 10 ? `0${date}` : date
    } ${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }`;

    data._id = _id;
    data.createdAt = createdAt;

    // firebase 에서 이미지 불러오기
    if (owner.profileImg) {
      const fileRef = ref(storageService, `${owner._id}/${owner.profileImg}`);
      const attachmentUrl = await getDownloadURL(fileRef);

      data.img = attachmentUrl;
    }

    await axios
      .post("http://localhost:4000/qna/comment", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const {
          data: { comments },
        } = response;

        setComments(comments);
      })
      .catch();

    setCommentValue("");
  };

  /** 대댓글 전송 */
  const onValid_2 = async (idx, comment, event) => {
    event.preventDefault();
    // 대댓글 작성란 빈 값이 아닌 경우에만 전송됨
    if (commentRef.current[idx].value !== "") {
      const today = new Date();

      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const date = today.getDate();

      const hours = today.getHours();
      const minutes = today.getMinutes();

      // 현재 날짜
      const createdAt = `${year}-${month < 10 ? `0${month}` : month}-${
        date < 10 ? `0${date}` : date
      } ${hours < 10 ? `0${hours}` : hours}:${
        minutes < 10 ? `0${minutes}` : minutes
      }`;

      const text = commentRef.current[idx].value;

      let ownComment = {
        userId: owner._id,
        nickname: owner.nickname,
        createdAt,
        comment: text,
      };

      // firebase 에서 이미지 불러오기
      if (owner.profileImg) {
        const fileRef = ref(storageService, `${owner._id}/${owner.profileImg}`);
        const attachmentUrl = await getDownloadURL(fileRef);

        ownComment.img = attachmentUrl;
      }

      const data = {
        text,
        ...comment,
        questionId: question._id,
        reply: ownComment,
      };

      await axios
        .post("http://localhost:4000/qna/reply", data, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const {
            data: { question },
          } = response;

          setComments(question.comments);
        });

      // 댓글 작성 끝난 경우 input 값 비우고, 댓글 작성란 없애기
      setReplyValue("");
      replyRef.current[idx].style.display = "none";
      setReplyIdx(-1);
    }
  };

  /** 댓글 textarea 높이 실시간 감지 및 변화 */
  const commentResizeHeight = (event) => {
    const {
      target: { value },
    } = event;

    event.target.style.height = "20px";
    event.target.style.height = event.target.scrollHeight + "px";

    setCommentValue(value);
  };

  /** 대댓글 textarea 높이 실시간 감지 및 변화 */
  const replyResizeHeight = (event) => {
    const {
      target: { value },
    } = event;

    event.target.style.height = "20px";
    event.target.style.height = event.target.scrollHeight + "px";

    setReplyValue(value);
  };

  const commentChatRoom = async (id) => {
    await axios
      .get("http://localhost:4000/chat/room", {
        params: { othersId: id },
        withCredentials: true,
      })
      .then((response) => {
        const {
          data: { roomId },
        } = response;

        navigate(`/chat/${roomId}`, {
          state: { roomId, profileImg },
        });
      });
  };

  /** 댓글 클릭 시 대댓글 작성 form 생성 */
  const handleReply = (idx, event) => {
    const { innerText } = event.target;
    if (innerText !== "삭제" && innerText !== "대화하기") {
      // 댓글을 처음 클릭했을 때 댓글 작성란 나타내기
      if (replyIdx === -1) {
        replyRef.current[idx].style.display = "flex";
        setReplyIdx(idx);
      }

      // 같은 댓글 한 번 더 클릭하면 댓글 작성란 닫기
      if (replyIdx === idx) {
        replyRef.current[idx].style.display = "none";
        setReplyIdx(-1);
      }

      // 댓글 작성란을 연 상태에서 다른 댓글을 클릭 시 현재 댓글 작성란을 닫고 새로 열기
      if (replyIdx !== -1 && replyIdx !== idx) {
        replyRef.current[replyIdx].style.display = "none";
        replyRef.current[idx].style.display = "flex";
        setReplyIdx(idx);
      }
    }
  };

  /** 댓글 삭제 */
  const handleDelComment = async (comment) => {
    await axios
      .get("http://localhost:4000/qna/delComment", {
        params: { commentId: comment._id, questionId: question._id },
        withCredentials: true,
      })
      .then((response) => {
        const {
          data: { question },
        } = response;

        setComments(question.comments);
      });
  };

  const handleDelReply = async (comment, reply) => {
    await axios
      .get("http://localhost:4000/qna/delReply", {
        params: {
          commentId: comment._id,
          replyId: reply._id,
          questionId: question._id,
        },
        withCredentials: true,
      })
      .then((response) => {
        const {
          data: { question },
        } = response;

        setComments(question.comments);
      });
  };

  return (
    <BodyContainer>
      <HeaderMenu />
      <Section>
        <QuestionBox>
          <Question question={question} ownId={owner._id} />
          <CommentBox>
            <form onSubmit={handleSubmit(onValid_1)}>
              <CommentInput>
                <Img
                  src={
                    ownProfileImg
                      ? ownProfileImg
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFagHdfZk7Vzisep4I1UZYuHANzTLHA3ECyw&usqp=CAU"
                  }
                />
                <textarea
                  {...register("comment", {
                    onChange: commentResizeHeight,
                  })}
                  value={commentValue}
                  rows={1}
                ></textarea>
                <Button>댓글</Button>
              </CommentInput>
            </form>
            <CommentViews>
              {comments.length ? (
                comments.map((comment, idx) => {
                  return (
                    <Comments key={comment._id}>
                      <Comment onClick={(event) => handleReply(idx, event)}>
                        <Img
                          src={
                            comment.img
                              ? comment.img
                              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFagHdfZk7Vzisep4I1UZYuHANzTLHA3ECyw&usqp=CAU"
                          }
                        />
                        <Detail>
                          <UserDetail>
                            <div>
                              {comment.nickname}{" "}
                              <span>{comment.createdAt}</span>
                            </div>
                            <div>
                              <div
                                onClick={() => commentChatRoom(comment.userId)}
                              >
                                대화하기
                              </div>
                              {comment.userId === owner._id ? (
                                <div
                                  onClick={() => handleDelComment(comment)}
                                  style={{ color: "red" }}
                                >
                                  삭제
                                </div>
                              ) : null}
                            </div>
                          </UserDetail>
                          <div>{comment.comment}</div>
                        </Detail>
                      </Comment>
                      {comment.replies.length
                        ? comment.replies.map((reply, idx) => {
                            return (
                              <CommentReplyBox>
                                <img
                                  src={
                                    reply.img
                                      ? reply.img
                                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFagHdfZk7Vzisep4I1UZYuHANzTLHA3ECyw&usqp=CAU"
                                  }
                                />

                                <CommentReplyInfo>
                                  <ReplyInfo>
                                    <div>
                                      {reply.nickname}
                                      <span>{reply.createdAt}</span>
                                    </div>
                                    <div>
                                      <div
                                        onClick={() =>
                                          commentChatRoom(reply.userId)
                                        }
                                      >
                                        대화하기
                                      </div>
                                      {reply.userId === owner._id ? (
                                        <div
                                          style={{ color: "red" }}
                                          onClick={() =>
                                            handleDelReply(comment, reply)
                                          }
                                        >
                                          삭제
                                        </div>
                                      ) : null}
                                    </div>
                                  </ReplyInfo>
                                  <ReplyComment>{reply.comment}</ReplyComment>
                                </CommentReplyInfo>
                              </CommentReplyBox>
                            );
                          })
                        : null}
                      <form>
                        <ReplyInput
                          ref={(el) => {
                            replyRef.current[idx] = el;
                          }}
                        >
                          <Img
                            src={
                              ownProfileImg
                                ? ownProfileImg
                                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFagHdfZk7Vzisep4I1UZYuHANzTLHA3ECyw&usqp=CAU"
                            }
                          />
                          <textarea
                            ref={(el) => (commentRef.current[idx] = el)}
                            onChange={replyResizeHeight}
                            value={replyValue}
                            rows={1}
                          ></textarea>
                          <Button
                            onClick={(event) => onValid_2(idx, comment, event)}
                          >
                            댓글
                          </Button>
                        </ReplyInput>
                      </form>
                    </Comments>
                  );
                })
              ) : (
                <NoComments></NoComments>
              )}
            </CommentViews>
          </CommentBox>
        </QuestionBox>
      </Section>
      <FooterMenu />
    </BodyContainer>
  );
};

export default QnABoard;

const QuestionBox = styled.div`
  margin-top: 50px;
`;

const CommentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 50px;
`;

const Comments = styled.div``;

const CommentInput = styled.div`
  display: flex;
  gap: 10px;

  textarea {
    width: 100%;
    height: 24px;
    line-height: 20px;
    border: none;
    border-bottom: 1px solid gray;
    resize: none;
    outline: none;

    &:focus {
      border-bottom: 1px solid black;
    }
  }
`;

const Button = styled.button`
  width: 50px;
  min-width: 50px;
  height: 30px;
  padding: 0;
  border: 1px solid gray;
  border-radius: 20px;
  background-color: #fffaf3;
  color: blue;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #ffd197;
  }
`;

const ReplyInput = styled(CommentInput)`
  display: none;
  margin-left: 30px;
`;

const Img = styled.img`
  width: 40px;
  min-width: 40px;
  height: 40px;
  min-height: 40px;
  border-radius: 20px;
  object-fit: cover;
`;

const CommentViews = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Comment = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  cursor: pointer;
`;

const Detail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 80vw;

  div {
    &:last-child {
      font-size: 15px;
    }
  }
`;

const UserDetail = styled.div`
  display: flex;
  justify-content: space-between;

  div {
    &:first-child {
      font-size: 13px;

      span {
        font-size: 10px;
        color: gray;
      }
    }

    &:last-child {
      display: flex;
      gap: 10px;
      font-size: 12px;
      cursor: pointer;
    }
  }
`;

const CommentReplyBox = styled.div`
  display: flex;
  margin: 10px 0 10px 30px;

  img {
    width: 40px;
    min-width: 40px;
    height: 40px;
    min-height: 40px;
    border-radius: 20px;
    object-fit: cover;
  }
`;

const CommentReplyInfo = styled.div`
  margin-left: 10px;
  width: 80vw;
`;

const ReplyInfo = styled.div`
  display: flex;
  justify-content: space-between;

  div {
    &:first-child {
      font-size: 13px;

      span {
        font-size: 10px;
        color: gray;
        margin-left: 5px;
      }
    }

    &:last-child {
      display: flex;
      gap: 10px;
      font-size: 12px;
      cursor: pointer;
    }
  }
`;

const ReplyComment = styled.div`
  margin-top: 5px;
`;

const NoComments = styled.div``;

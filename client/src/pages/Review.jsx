import styled from "styled-components";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faEye,
  faCommentAlt,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import HeaderMenu from "../components/HeaderMenu";
import { BodyContainer } from "../styles/Style";
import { Section } from "../styles/Style";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { ref, getDownloadURL } from "@firebase/storage";
import { storageService } from "../firebase";
import { useRef } from "react";

const ReviewBoard = () => {
  const replyRef = useRef([]);
  const commentRef = useRef([]);
  const {
    state: { review, likes, ownId, profileImg, reviewImg },
  } = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  // 유저 좋아요 DB 에 review 게시물 id 가 있으면 true, 없으면 false
  const bool = likes.includes(review._id);
  // 좋아요 상태 관리
  const [like, setLike] = useState(bool);
  const starArr = Array.from(Array(5), (i, idx) =>
    idx < review.score ? true : false
  );
  const [comments, setComments] = useState([...review.comments]);
  const [commentValue, setCommentValue] = useState("");
  const [replyValue, setReplyValue] = useState("");
  const [ownProfileImg, setOwnProfileImg] = useState("");
  const [owner, setOwner] = useState({});
  const [replyIdx, setReplyIdx] = useState(-1);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectImg, setSelectImg] = useState("");

  useEffect(() => {
    loadUser();
  }, [selectImg]);

  /** 나의 프로필 이미지 */
  const loadUser = async () => {
    const selected = [];
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

        // 키워드 가져오기
        const commonArr = Object.entries(user.common);
        commonArr.map((keyword) => {
          const keywordArr = Object.entries(keyword[1]);
          keywordArr.map((key) => {
            if (key[1] === true) {
              selected.push(key[0]);
            }
          });
        });

        setSelectedKeywords([...selected]);
        setOwner(user);
      });
  };

  /** 댓글 전송 */
  const onValid_1 = async (data) => {
    const { _id } = review;
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
      .post("http://localhost:4000/main/comment", data, {
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
        reviewId: review._id,
        reply: ownComment,
      };

      await axios
        .post("http://localhost:4000/main/reply", data, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const {
            data: { review },
          } = response;

          setComments(review.comments);
        });

      // 댓글 작성 끝난 경우 input 값 비우고, 댓글 작성란 없애기
      setReplyValue("");
      replyRef.current[idx].style.display = "none";
      setReplyIdx(-1);
    }
  };

  /** 대화하기 클릭 시 채팅방 입장 */
  const EnterChatRoom = async () => {
    const { userId } = review;
    await axios
      .get("http://localhost:4000/chat/room", {
        params: { othersId: userId },
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

  const handleReviewImg = (event) => {
    setSelectImg(event.target.src);
  };

  /** 좋아요 클릭 */
  const onClickLike = async () => {
    const { _id } = review;
    setLike((prev) => !prev);

    await axios.get("http://localhost:4000/main/like", {
      params: { _id, like: !like },
      withCredentials: true,
    });
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
      .get("http://localhost:4000/main/delComment", {
        params: { commentId: comment._id, reviewId: review._id },
        withCredentials: true,
      })
      .then((response) => {
        const {
          data: { review },
        } = response;

        setComments(review.comments);
      });
  };

  const handleDelReply = async (comment, reply) => {
    await axios
      .get("http://localhost:4000/main/delReply", {
        params: {
          commentId: comment._id,
          replyId: reply._id,
          reviewId: review._id,
        },
        withCredentials: true,
      })
      .then((response) => {
        const {
          data: { review },
        } = response;

        setComments(review.comments);
      });
  };
  return (
    <BodyContainer>
      <HeaderMenu />
      <Section>
        <ReviewBox>
          <User>
            <Name>
              <img
                src={
                  profileImg
                    ? profileImg
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFagHdfZk7Vzisep4I1UZYuHANzTLHA3ECyw&usqp=CAU"
                }
              />
              <div>user</div>
            </Name>
            {review.userId !== ownId ? (
              <ChatLink onClick={EnterChatRoom}>대화하기</ChatLink>
            ) : null}
          </User>
          <ReviewInfo>
            <Group>
              <Category type="button">{review.category}</Category>
            </Group>
            <Group>
              <Image>
                <img
                  src={
                    selectImg
                      ? selectImg
                      : reviewImg.length
                      ? reviewImg[0]
                      : null
                  }
                />
              </Image>
              <ProductInfo>
                <div>{review.brand}</div>
                <div>{review.product}</div>
                <div>
                  {starArr.map((star, idx) => {
                    return (
                      <span key={idx}>
                        <FontAwesomeIcon
                          icon={faStar}
                          color={star ? "#FFDAB9" : "gray"}
                        />
                      </span>
                    );
                  })}
                </div>
              </ProductInfo>
            </Group>
            <Group>
              {reviewImg.length
                ? reviewImg.map((img) => {
                    return (
                      <img
                        src={img}
                        style={{
                          width: "50px",
                          height: "50px",
                          cursor: "pointer",
                        }}
                        onClick={handleReviewImg}
                      />
                    );
                  })
                : null}
            </Group>
            <KeywordGroup>
              <KeywordsTitle>공통 키워드</KeywordsTitle>
              <KeywordsBox>
                {selectedKeywords.map((keyword, idx) => {
                  return <button key={idx}>{keyword}</button>;
                })}
              </KeywordsBox>
            </KeywordGroup>
            <KeywordGroup>
              <KeywordsTitle>직접 입력 키워드</KeywordsTitle>
              <KeywordsBox>
                {review.keywords.map((keyword, idx) => {
                  return <button key={idx}>{keyword}</button>;
                })}
              </KeywordsBox>
            </KeywordGroup>
            <Group>
              <KeywordsBox>
                {review.keywords.map((keyword, idx) => {
                  return <button key={idx}>{keyword}</button>;
                })}
              </KeywordsBox>
            </Group>
            <Group>
              <Motivation>
                <div>구매동기</div>
                <div>{review.motivation}</div>
              </Motivation>
            </Group>
            <Group>
              <Adventages>
                <div>장점</div>
                <div>{review.adventages}</div>
              </Adventages>
            </Group>
            <Group>
              <DisAdventages>
                <div>아쉬운점</div>
                <div>{review.disadventages}</div>
              </DisAdventages>
            </Group>
            <Group>
              <LikeButton onClick={onClickLike}>
                <span>좋아요</span>
              </LikeButton>
            </Group>
          </ReviewInfo>
          <Eval>
            <div>
              <FontAwesomeIcon icon={faEye} />
              <span>{review.views}</span>
            </div>
            <div>
              <FontAwesomeIcon icon={faThumbsUp} />
              <span>{like ? 1 : 0}</span>
            </div>
            <div>
              <FontAwesomeIcon icon={faCommentAlt} />
              <span>{comments.length}</span>
            </div>
          </Eval>
        </ReviewBox>
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
              <button>댓글 입력</button>
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
                            {comment.nickname} <span>{comment.createdAt}</span>
                          </div>
                          <div>
                            <div>대화하기</div>
                            {comment.userId === ownId ? (
                              <div onClick={() => handleDelComment(comment)}>
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
                                    <div>대화하기</div>
                                    {reply.userId === ownId ? (
                                      <div
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
                        <button
                          onClick={(event) => onValid_2(idx, comment, event)}
                        >
                          댓글 전송
                        </button>
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
      </Section>
    </BodyContainer>
  );
};

export default ReviewBoard;

const ReviewBox = styled.div`
  margin-top: 50px;
  border: 1px solid black;
  border-radius: 5px;
  overflow: hidden;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 15px;
  background-color: rgba(0, 0, 0, 0.3);

  img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    border-radius: 15px;
    object-fit: cover;
  }
`;

const Name = styled.div`
  display: flex;
  align-items: center;
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

const ReviewInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: max-content;
  padding: 15px;
  box-sizing: border-box;
`;

const Group = styled.div`
  display: flex;
`;

const KeywordGroup = styled.div`
  max-width: 250px;
`;

const Category = styled.button`
  font-weight: bold;
  cursor: pointer;
`;

const Image = styled.div`
  img {
    width: 100px;
    height: 100px;
    border-radius: 5px;
    object-fit: cover;
    cursor: pointer;
  }
`;

const ProductInfo = styled.div`
  margin-left: 15px;
  div {
    margin-bottom: 5px;
    &:first-child {
      font-size: 12px;
      color: gray;
    }

    &:nth-child(2) {
      font-weight: bold;
    }
  }
`;

const KeywordsTitle = styled.div`
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const KeywordsBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Motivation = styled.div`
  width: 100%;
  div {
    // 구매동기
    &:first-child {
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    // 구매동기 입력란
    &:last-child {
      font-size: 12px;
      color: gray;
      margin-bottom: 5px;
    }
  }
`;

const Adventages = styled.div`
  width: 100%;
  div {
    // 장점
    &:first-child {
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    // 장점 입력란
    &:last-child {
      font-size: 12px;
      color: gray;
    }
  }
`;

const DisAdventages = styled(Adventages)`
  div {
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const LikeButton = styled.button`
  display: inline-block;
  position: relative;
  width: 130px;
  height: 40px;
  line-height: 42px;
  padding: 0;
  border-radius: 5px;
  border: none;
  box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
    7px 7px 20px 0px rgba(0, 0, 0, 0.1), 4px 4px 5px 0px rgba(0, 0, 0, 0.1);
  outline: none;
  color: #fff;
  background-image: linear-gradient(315deg, #f0ecfc 0%, #c797eb 74%);
  font-family: "Lato", sans-serif;
  font-weight: 500;
  cursor: pointer;

  span {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
  }

  &:before,
  &:after {
    position: absolute;
    content: "";
    right: 0;
    bottom: 0;
    background: #c797eb;
    /*box-shadow:  4px 4px 6px 0 rgba(255,255,255,.5),
              -4px -4px 6px 0 rgba(116, 125, 136, .2), 
    inset -4px -4px 6px 0 rgba(255,255,255,.5),
    inset 4px 4px 6px 0 rgba(116, 125, 136, .3);*/
    transition: all 0.3s ease;
  }

  &:before {
    height: 0%;
    width: 2px;
  }

  &:after {
    width: 0%;
    height: 2px;
  }

  &:hover:before {
    height: 100%;
  }

  &:hover:after {
    width: 100%;
  }

  &:hover {
    background: transparent;
  }

  & span:hover {
    color: #c797eb;
  }

  & span:before,
  & span:after {
    position: absolute;
    content: "";
    left: 0;
    top: 0;
    background: #c797eb;
    /*box-shadow:  4px 4px 6px 0 rgba(255,255,255,.5),
              -4px -4px 6px 0 rgba(116, 125, 136, .2), 
    inset -4px -4px 6px 0 rgba(255,255,255,.5),
    inset 4px 4px 6px 0 rgba(116, 125, 136, .3);*/
    transition: all 0.3s ease;
  }

  & span:before {
    width: 2px;
    height: 0%;
  }

  & span:after {
    height: 2px;
    width: 0%;
  }

  & span:hover:before {
    height: 100%;
  }

  & span:hover:after {
    width: 100%;
  }
`;

const Eval = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  padding-left: 15px;
  background-color: rgba(0, 0, 0, 0.3);
  div {
    margin-right: 30px;

    svg {
      margin-right: 10px;
    }
  }
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

const ReplyInput = styled(CommentInput)`
  display: none;
  margin-left: 30px;
`;

const Img = styled.img`
  width: 40px;
  height: 40px;
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
    height: 40px;
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

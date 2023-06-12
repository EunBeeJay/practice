import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faThumbsUp,
  faEye,
  faCommentAlt,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import { useEffect, useRef } from "react";
import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import { ref, getDownloadURL } from "@firebase/storage";
import { storageService } from "../firebase";
import ReviewEdit from "../modal/ReviewEdit";

const ItemReview = ({ review, likes, ownId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // 더보기 클릭을 했을 때 hidden 엘리먼트 나타내기
  const showGroup = useRef();
  // 유저 좋아요 DB 에 review 게시물 id 가 있으면 true, 없으면 false
  const bool = likes.includes(review._id);
  // 좋아요 상태 관리
  const [like, setLike] = useState(bool);
  const starArr = Array.from(Array(5), (i, idx) =>
    idx < review.score ? true : false
  );
  const [confirm, setConfirm] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [profileImg, setProfileImg] = useState("");
  const [reviewImg, setReviewImg] = useState([]);

  // 수정 및 삭제 버튼 나타내기
  const [editButton, setEditButton] = useState(false);

  useEffect(() => {
    handleEditButton();
    loadUserInfo();
    loadReviewImg();
  }, []);

  const handleEditButton = () => {
    const { pathname } = location;

    if (pathname === "/profile/myReview") {
      setEditButton(true);
    }
  };

  /** 리뷰 이미지 사진 불러오기 */
  const loadReviewImg = async () => {
    const { reviewId, images } = review;
    let imgArr = [];

    for (let i = 0; i < images; i++) {
      const fileRef = ref(storageService, `${reviewId}/${i}`);
      const attachmentUrl = await getDownloadURL(fileRef);
      imgArr.push(attachmentUrl);
    }

    setReviewImg([...imgArr]);
  };

  /** 유저 정보 - 프로필 이미지 및 키워드 */
  const loadUserInfo = async () => {
    const { userId } = review;
    const selected = [];
    await axios
      .get("http://localhost:4000/main/keywords", {
        params: { userId },
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

          setProfileImg(attachmentUrl);
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
      });
  };

  /** 유저 프로필 이동 */
  const userProfile = () => {
    if (ownId === review.userId) {
      navigate(`/profile`, { state: review.userId });
    } else {
      navigate(`/profile/${review.userId}`, { state: review.userId });
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

        navigate(`chat/${roomId}`, {
          state: { roomId, profileImg },
        });
        // url 이 undefined 가 뜸
      });
  };

  /** 더보기 클릭 시 hiddenGroup 이 보임 및 더보기 기능 숨기기 */
  const handleSeeMore = (event) => {
    showGroup.current.style.display = "flex";
    event.target.parentElement.style.display = "none";

    setConfirm(true);
  };

  /** 좋아요 클릭 */
  const onClickLike = async () => {
    const { _id } = review;
    setLike((prev) => !prev);

    await axios.get("http://localhost:4000/main/like", {
      params: { _id, like: !like },
      withCredentials: true,
    });

    addView();
  };

  /** 리뷰 여백 클릭 시 상세페이지로 이동 */
  const handleLink = (event) => {
    // 더보기 클릭했을 시 상세페이지 이동해도 조회수 늘어나지 않음
    if (confirm) {
      setConfirm(false);
    } else {
      addView();
    }

    if (event.target.nodeName === "DIV") {
      navigate(`/${review.reviewId}`, {
        state: { review, likes, ownId, profileImg, reviewImg },
      });
    }
  };

  /** 리뷰 더보기 또는 상세페이지로 이동 시 조회수 1 증가 */
  const addView = async () => {
    const { _id } = review;

    await axios.get("http://localhost:4000/main/view", {
      params: { _id },
      withCredentials: true,
    });
  };

  /** 리뷰 수정 */
  const handleEdit = () => {
    const { reviewId } = review;
    navigate(`/profile/myReview/edit/${reviewId}`, {
      state: { edit: true },
    });
  };

  /** 리뷰 삭제 */
  const handleDelete = async () => {
    const { _id } = review;

    await axios.get("http://localhost:4000/main/delete", {
      params: { reviewId: _id },
      withCredentials: true,
    });
  };

  return (
    <>
      <AnimatePresence>
        <ReviewBox>
          <User>
            <Name onClick={userProfile}>
              <img
                src={
                  profileImg
                    ? profileImg
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFagHdfZk7Vzisep4I1UZYuHANzTLHA3ECyw&usqp=CAU"
                }
              />
              <div>{review.nickname}</div>
            </Name>
            {review.userId !== ownId ? (
              <ChatLink onClick={EnterChatRoom}>대화하기</ChatLink>
            ) : null}
            {editButton && (
              <Edit>
                <motion.div onClick={handleEdit}>수정</motion.div>
                <div onClick={handleDelete}>삭제</div>
              </Edit>
            )}
          </User>
          <ReviewInfo onClick={handleLink}>
            <Group>
              <Category type="button">{review.category}</Category>
            </Group>
            <Group>
              <Image>
                <img
                  src={
                    reviewImg.length
                      ? reviewImg[0]
                      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOoAAADXCAMAAAAjrj0PAAAAA1BMVEXy8vJkA4prAAAAR0lEQVR4nO3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHBpxV0AAUHjYSwAAAAASUVORK5CYII="
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
                          size="lg"
                          color={star ? "#FFDAB9" : "gray"}
                        />
                      </span>
                    );
                  })}
                </div>
              </ProductInfo>
            </Group>
            <KeywordGroup>
              <KeywordsTitle>공통 키워드</KeywordsTitle>
              <KeywordsBox>
                {selectedKeywords.map((keyword, idx) => {
                  return <KeywordBtn key={idx}>{keyword}</KeywordBtn>;
                })}
              </KeywordsBox>
            </KeywordGroup>
            <KeywordGroup>
              <KeywordsTitle>직접 입력 키워드</KeywordsTitle>
              <KeywordsBox>
                {review.keywords.map((keyword, idx) => {
                  return <KeywordBtn key={idx}>{keyword}</KeywordBtn>;
                })}
              </KeywordsBox>
            </KeywordGroup>
            <Group>
              <Motivation>
                <div>구매동기</div>
                <div>{review.motivation}</div>
                <div
                  onClick={handleSeeMore}
                  style={{ width: "50px", cursor: "pointer" }}
                >
                  <span>더보기</span>
                  <FontAwesomeIcon icon={faChevronDown} />
                </div>
              </Motivation>
            </Group>
            <HiddenGroup ref={showGroup}>
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
            </HiddenGroup>
            <Group>
              {bool ? (
                <CLButton onClick={onClickLike}>
                  <span>좋아요</span>
                </CLButton>
              ) : (
                <LikeButton onClick={onClickLike}>
                  <span>좋아요</span>
                </LikeButton>
              )}
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
              <span>{review.comments.length}</span>
            </div>
          </Eval>
        </ReviewBox>
      </AnimatePresence>
      <AnimatePresence>
        <ReviewEdit review={review} />
      </AnimatePresence>
    </>
  );
};

export default ItemReview;

const ReviewBox = styled.div`
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
  background-color: #909fc8;

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
  cursor: pointer;
`;

const ChatLink = styled.div`
  padding: 5px;
  box-sizing: border-box;
  border: 1px solid gray;
  border-radius: 5px;
  background-color: white;
  border: none;
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
  gap: 5px;

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

const HiddenGroup = styled.div`
  display: none;
  flex-direction: column;
  gap: 15px;
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
  }
`;

const ProductInfo = styled.div`
  margin-left: 15px;
  div {
    margin-bottom: 5px;
    &:first-child {
      font-size: 12px;
      font-weight: bold;
      color: #009cdb;
    }

    &:nth-child(2) {
      font-size: 20px;
      font-weight: bold;
      color: gray;
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

const KeywordBtn = styled.button`
  border-radius: 15px;
  border-color: gray;
  color: #5ba4e7;
  font-weight: bold;
  border: 1px solid gray;
  background-color: #fffaf4;
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
    &:nth-child(2) {
      font-size: 12px;
      color: gray;
      margin-bottom: 5px;
    }

    // 더보기
    &:last-child {
      font-size: 12px;
      font-weight: bold;
      margin-top: 15px;
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
  background-image: linear-gradient(315deg, #c5efed 0%, #9153d7 74%);
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

const CLButton = styled.button`
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
  background-image: linear-gradient(315deg, #c5efed 0%, #9153d7 74%);
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

  &:before {
    height: 100%;
  }

  &:after {
    width: 100%;
  }

  & {
    background: transparent;
  }

  & span {
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

  & span:before {
    height: 100%;
  }

  & span:after {
    width: 100%;
  }
`;

const Eval = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  padding-left: 15px;
  background-color: #909fc8;
  color: white;
  div {
    margin-right: 30px;

    svg {
      margin-right: 10px;
    }
  }
`;

/* label 글자 일정 수 넘으면 ... 표시
const Label = styled.label`
  display: inline-block;
  font-size: 0.8rem;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
*/

import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faStar } from "@fortawesome/free-solid-svg-icons";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ErrorMessage } from "../styles/Error";

import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { storageService } from "../firebase";

const overlayVariants = {
  inital: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
  visible: { opacity: 1, scale: 1 },
  hidden: {
    opacity: 0,
    scale: 1,
    transition: { duration: 0.1 },
  },
};

const pageVariants = {
  inital: {
    opacity: 1,
    scale: 0,
    transition: { type: "linear", duration: 0.3 },
  },
  visible: { opacity: 1, scale: 1 },
  hidden: {
    opacity: 0,
    scale: 1,
    transition: { type: "linear", duration: 0.1 },
  },
};

const ReviewEdit = ({ review }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // 미리보기 이미지
  const [previewImgs, setPreviewImgs] = useState([]);
  // 키워드
  const [keywords, setKeywords] = useState([]);
  const [keywordsValue, setKeywordsValue] = useState("");
  // 별점
  const [starGrade, setStarGrade] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  // 점수
  const [score, setScore] = useState(0);
  const { state } = location;
  const [clickEdit, setClickEdit] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  useEffect(() => {
    loadReviewValue();
    setClickEdit(state?.edit);
  }, [state]);

  /** 리뷰에 저장된 값들 불러오기 */
  const loadReviewValue = async () => {
    const { reviewId, keywords, score, images } = review;
    let imgArr = [];

    // 별점
    let starState = Array.from(Array(5), () => false);
    for (let i = 0; i < score; i++) {
      starState[i] = true;
    }

    // 리뷰 이미지
    for (let i = 0; i < images; i++) {
      const fileRef = ref(storageService, `${reviewId}/${i}`);
      const attachmentUrl = await getDownloadURL(fileRef);
      imgArr.push(attachmentUrl);
    }

    setKeywords([...keywords]);
    setStarGrade([...starState]);
    setScore(score + 1);
    setPreviewImgs([...imgArr]);
  };

  const onValid = async (data) => {
    /* formData 를 이용한 전송방식. 이미지 업로드 안되는 문제
    let formData = new FormData();

    formData.append("reviewData", JSON.stringify(data));
    formData.append("keywords", JSON.stringify(keywords));
    formData.append("images", previewImgs.length);
    */

    data._id = review._id;
    data.score = score;
    data.keywords = [...keywords];
    data.images = previewImgs.length;

    delete data.image;

    await axios
      .post("http://localhost:4000/main/edit", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async (response) => {
        const {
          data: { review },
        } = response;
        console.log(review);
        const { reviewId } = review;

        // firebase 에 리뷰 사진 업로드
        if (previewImgs.length) {
          previewImgs.map(async (img, idx) => {
            const fileRef = ref(storageService, `${reviewId}/${idx}`);
            await uploadString(fileRef, img, "data_url");
          });
        }

        navigate("/profile/myReview", { state: { review } });
        setClickEdit(false);
      })
      .catch((err) => {
        console.log(`리뷰 수정 클라이언트 ${err}`);
      });
  };

  // input 에 엔터 키 눌렀을 때 submit 방지
  const onEnterDown = (event) => {
    const {
      target: { nodeName },
    } = event;

    if (nodeName === "INPUT" && event.key === "Enter") {
      event.preventDefault();
    }
  };

  /** textarea 높이 실시간 감지 및 변화 */
  const handleResizeHeight = (event) => {
    event.target.style.height = "39px";
    event.target.style.height = event.target.scrollHeight + "px";
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

        fileUrls[i] = reader.result;
        let validLength = previewImgs.length + fileUrls.length;

        // 최대 5장까지 업로드
        if (validLength < 6) {
          setPreviewImgs([...fileUrls, ...previewImgs]);
        } else {
          setError("image", { message: "* 최대 5장까지 업로드 가능합니다." });
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  /** 프리뷰 이미지 삭제 */
  const handleDelPreview = (index) => {
    const filesArr = previewImgs.filter((url, idx) => idx !== index);
    setPreviewImgs([...filesArr]);
  };

  /** 키워드 입력 */
  const handleKeywords = (event) => {
    const {
      target: { value },
    } = event;

    if (event.key === "Enter" && value !== "") {
      const {
        target: { value },
      } = event;
      setKeywords([...keywords, value]);
      setKeywordsValue("");
    }
  };

  /** 키워드 삭제 */
  const handleDelKeywords = (index) => {
    const keywordsArr = keywords.filter((words, idx) => idx !== index);
    setKeywords([...keywordsArr]);
  };

  /** 키워드 input 입력 값 상태 관리 */
  const onChange = (event) => {
    setKeywordsValue(event.target.value);
  };

  /** 별점 */
  const onClickStar = (index) => {
    let starState = Array.from(Array(5), () => false);
    for (let i = 0; i <= index; i++) {
      starState[i] = true;
    }

    setScore(index + 1);
    setStarGrade(starState);
  };

  /** 메인화면으로 이동 */
  const onClickMain = () => {
    setClickEdit(false);
    navigate("/profile/myReview");
  };
  return (
    <>
      <AnimatePresence>
        {clickEdit ? (
          <>
            <Overlay
              onClick={onClickMain}
              variants={overlayVariants}
              initial="inital"
              animate="visible"
              exit="hidden"
            />
            <UploadPage
              variants={pageVariants}
              initial="inital"
              animate="visible"
              exit="hidden"
            >
              <form onSubmit={handleSubmit(onValid)} onKeyDown={onEnterDown}>
                <Group>
                  <Title>
                    <label htmlFor="category">카테고리</label>
                  </Title>
                  <Category
                    id="category"
                    {...register("category", {
                      required: "* 카테고리를 선택해주세요",
                    })}
                    defaultValue={review && review.category}
                  >
                    <option value="" style={{ display: "none" }}></option>
                    <option value="디지털기기">디지털기기</option>
                    <option value="생활가전">생활가전</option>
                    <option value="가구/인테리어">가구/인테리어</option>
                    <option value="육아/유아동">육아/유아동</option>
                    <option value="생활/주방용품">생활/주방용품</option>
                    <option value="의류/가방/지갑/잡화">
                      의류/가방/지갑/잡화
                    </option>
                    <option value="뷰티/미용">뷰티/미용</option>
                  </Category>
                  <ErrorMessage>{errors?.category?.message}</ErrorMessage>
                </Group>
                <Group>
                  <Title>
                    <label htmlFor="brand">브랜드</label>
                  </Title>
                  <Input
                    id="brand"
                    {...register("brand")}
                    placeholder="브랜드명을 입력하세요"
                    defaultValue={review && review.brand}
                  />
                </Group>
                <Group>
                  <Title>
                    <label htmlFor="product">상품명</label>
                  </Title>
                  <Input
                    id="product"
                    {...register("product")}
                    placeholder="상품명을 입력하세요"
                    defaultValue={review && review.product}
                  />
                </Group>
                <Group>
                  <Title>
                    <label htmlFor="imageInput">이미지</label>
                  </Title>
                  <GridImgBox>
                    <Image>
                      <div>
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{ fontSize: "25px" }}
                        />
                      </div>
                      <input
                        id="imageInput"
                        type="file"
                        style={{ display: "none" }}
                        name="images"
                        accept="image/*"
                        multiple
                        {...register("image", {
                          onChange: handlePreview,
                          validate: () => {
                            if (previewImgs.length < 1) {
                              return "* 최소 1장의 이미지를 업로드해주세요.";
                            }
                          },
                        })}
                      />
                    </Image>
                    {previewImgs.map((url, index) => (
                      <Preview
                        key={index}
                        style={{
                          backgroundImage: `url(${url})`,
                        }}
                      >
                        <DelButton>
                          <FontAwesomeIcon
                            icon={faTimes}
                            onClick={() => handleDelPreview(index)}
                          />
                        </DelButton>
                      </Preview>
                    ))}
                  </GridImgBox>
                  <ErrorMessage>{errors?.image?.message}</ErrorMessage>
                </Group>
                <Group>
                  <Title>
                    <label htmlFor="motivation">구매동기</label>
                  </Title>
                  <Textarea
                    {...register("motivation", {
                      onChange: handleResizeHeight,
                    })}
                    defaultValue={review && review.motivation}
                    rows={1}
                  ></Textarea>
                </Group>
                <Group>
                  <Title>
                    <label htmlFor="adventages">장점</label>
                  </Title>
                  <Textarea
                    {...register("adventages", {
                      onChange: handleResizeHeight,
                    })}
                    defaultValue={review && review.adventages}
                    rows={1}
                  ></Textarea>
                </Group>
                <Group>
                  <Title>
                    <label htmlFor="disadventages">아쉬운점</label>
                  </Title>
                  <Textarea
                    {...register("disadventages", {
                      onChange: handleResizeHeight,
                    })}
                    defaultValue={review && review.disadventages}
                    rows={1}
                  ></Textarea>
                </Group>
                <Group>
                  <Title>
                    <label htmlFor="keywords">키워드</label>
                  </Title>
                  <Input
                    id="keywords"
                    onKeyDown={handleKeywords}
                    onChange={onChange}
                    value={keywordsValue}
                    placeholder="키워드를 입력하세요"
                  />
                  <KeywordsBox>
                    {keywords.map((word, index) => {
                      return (
                        <Keyword key={index}>
                          <div>{word}</div>
                          <FontAwesomeIcon
                            icon={faTimes}
                            onClick={() => handleDelKeywords(index)}
                          />
                        </Keyword>
                      );
                    })}
                  </KeywordsBox>
                </Group>
                <Group>
                  <input
                    type="text"
                    value={score}
                    style={{ display: "none" }}
                    {...register("score", {
                      validate: () => {
                        if (score === 0) {
                          return "* 평점을 입력해주세요.";
                        }
                      },
                    })}
                  />
                  <StarRate>
                    {starGrade.map((th, idx) => {
                      return (
                        <span key={idx} className="star_icon">
                          <FontAwesomeIcon
                            onClick={() => onClickStar(idx)}
                            icon={faStar}
                            size="3x"
                            color={starGrade[idx] ? "#FFDAB9" : "gray"}
                            style={{ cursor: "pointer" }}
                          />
                        </span>
                      );
                    })}
                  </StarRate>
                  <ErrorMessage>{errors?.score?.message}</ErrorMessage>
                </Group>
                <Group>
                  <UploadButton>리뷰 등록</UploadButton>
                </Group>
              </form>
            </UploadPage>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default ReviewEdit;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const UploadPage = styled(motion.div)`
  position: fixed;
  width: 90vw;
  height: 70vh;
  top: 100px;
  left: 0;
  right: 0;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 5px;
  background-color: white;
  z-index: 15;
  overflow: auto;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    height: 30%; /* 스크롤바의 길이 */
    background: #217af4; /* 스크롤바의 색상 */

    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(33, 122, 244, 0.1); /*스크롤바 뒷 배경 색상*/
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0 20px 0;
`;

const Title = styled.h1`
  margin-bottom: 5px;
  font-size: 13px;
`;

const Category = styled.select`
  width: 100%;
  height: 35px;
  padding: 0;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
  border-width: 0;
  border: 2px solid rebeccapurple;
  border-radius: 5px;
  font-size: 15px;
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

const Textarea = styled.textarea`
  resize: none;
  width: 100%;
  height: 35px;
  line-height: 27px;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
  border-width: 0;
  border: 2px solid rebeccapurple;
  border-radius: 5px;
  font-size: 15px;
  overflow: hidden;
`;

const GridImgBox = styled.div`
  display: grid;
  gap: 15px;
  grid-template-columns: repeat(auto-fill, 100px);
`;

const Image = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
`;

const Preview = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 5px;
  background-size: cover;
  &:hover {
    filter: brightness(0.8);
  }
`;

const DelButton = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  opacity: 0;
  svg {
    font-size: 18px;
    cursor: pointer;
  }
  &:hover {
    opacity: 1;
  }
`;

const KeywordsBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  gap: 10px;
`;

const Keyword = styled.div`
  display: flex;
  width: max-content;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.3);
  svg {
    margin-left: 5px;
    cursor: pointer;
  }
`;

const StarRate = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 100px;
  span {
    display: inline-flex;
    margin-right: 5px;
  }
`;

const UploadButton = styled.button`
  height: 35px;
`;

const UploadTrigger = styled(motion.div)`
  position: fixed;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  right: 15px;
  bottom: 55px;
  border: 1px solid black;
  background-color: white;
  cursor: pointer;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  div {
    &:first-child {
      font-size: 16px;
    }
    &:last-child {
      font-size: 12px;
      font-weight: bold;
    }
  }
`;

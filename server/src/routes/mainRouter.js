import multer from "multer";
import express from "express";
import "express-session";

import Review from "../models/Review.js";
import User from "../models/User.js";
import Reply from "../models/Reply.js";

const mainRouter = express.Router();

const storage = multer.diskStorage({
  // 저장 경로
  destination: function (req, file, cb) {
    cb(null, "/public");
  },
  // 파일 이름
  filename: function (req, file, cb) {
    const uniqueName = new Date().getTime().toString(36);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

/** 홈페이지 */
mainRouter.get("/", async (req, res) => {
  const { userId } = req.session;

  try {
    const reviews = await Review.find({});
    const { reviewLikes } = await User.findById(userId);

    return res.status(200).send({ reviews, reviewLikes, userId });
  } catch {
    console.log("리뷰 파일이 존재하지 않음.");
  }
});

/** 유저 정보 */
mainRouter.get("/user", async (req, res) => {
  const { userId } = req.session;

  try {
    const user = await User.findById(userId);

    return res.status(200).send({ user });
  } catch (err) {
    console.log(`메인화면 유저 정보 라우터 에러 ${err}`);

    return res.status(400).send({});
  }
});

/** 리뷰 작성자의 공통 키워드 */
mainRouter.get("/keywords", async (req, res) => {
  const { userId } = req.query;

  const user = await User.findById(userId);
  return res.status(200).send({ user });
});

/** 좋아요 */
mainRouter.get("/like", async (req, res) => {
  const { userId } = req.session;
  const { _id, like } = req.query;

  const user = await User.findById(userId);
  const review = await Review.findById(_id);

  if (like === "true") {
    user.reviewLikes.push(_id);
    review.likes++;
    user.save();
    review.save();
  } else {
    user.reviewLikes = user.reviewLikes.filter(
      (id) => String(id) !== String(_id)
    );
    review.likes--;
    user.save();
    review.save();
  }
});

/** review 업로드 */
mainRouter.post("/upload", async (req, res) => {
  const { userId } = req.session;
  const data = req.body;

  /* formData 를 이용한 전송방식
  // formdata 를 json 형식 변환하기
  const stringData = JSON.stringify(req.body);
  const parsing = JSON.parse(stringData);
  const dataParsing = JSON.parse(parsing.reviewData);
  const keywordsParsing = JSON.parse(parsing.keywords);

  const review = { userId, ...dataParsing, keywords: keywordsParsing };
  */

  const review = { userId, ...data };

  try {
    // 업로드 한 user 의 정보 받기
    const user = await User.findById(userId);

    // 고유한 리뷰 ID 생성
    const reviewId = new Date().getTime().toString(36);

    // Review 데이터베이스 생성
    const uploaded = await Review.create({
      ...review,
      nickname: user.nickname,
      reviewId,
    });
    // user uploadFiles 에 review 의 고유 id 를 배열에 저장 및 데이터베이스 변경
    user.uploadFiles.unshift(uploaded._id);
    user.save();

    return res.status(200).send({ reviewId });
  } catch (err) {
    console.log(`리뷰 업로드 라우터 에러: ${err}`);

    return res.status(400).send({});
  }
});

/** 조회수 */
mainRouter.get("/view", async (req, res) => {
  const { _id } = req.query;

  try {
    const review = await Review.findById(_id);
    review.views++;
    review.save();
  } catch (err) {
    console.log(`리뷰 조회수 라우터 에러: ${err}`);
  }
});

/** 리뷰 댓글 */
mainRouter.post("/comment", async (req, res) => {
  const { userId, nickname } = req.session;
  const { comment, createdAt, _id, img } = req.body;

  const commentObj = {
    userId,
    nickname,
    comment,
    createdAt,
  };

  if (img) {
    commentObj.img = img;
  }

  try {
    const review = await Review.findById(_id);
    review.comments.unshift(commentObj);
    review.save();

    const { comments } = review;

    return res.status(200).send({ comments });
  } catch (err) {
    console.log(`리뷰 댓글 라우터 에러: ${err}`);

    return res.status(400).send({});
  }
});

/** 리뷰 대댓글 */
mainRouter.post("/reply", async (req, res) => {
  const data = req.body;
  const { reply } = data;

  try {
    const review = await Review.findById(data.reviewId);
    const comment = review.comments.filter(
      (comment) => String(comment._id) === String(data._id)
    );
    comment[0].replies.push(reply);
    review.save();

    return res.status(200).send({ review });
  } catch (err) {
    console.log(`리뷰 대댓글 라우터 에러 ${err}`);

    return res.status(400).send({});
  }
});

/** 댓글 삭제 */
mainRouter.get("/delComment", async (req, res) => {
  const { commentId, reviewId } = req.query;

  try {
    let review = await Review.findById(reviewId);
    review.comments = review.comments.filter(
      (comment) => String(comment._id) !== String(commentId)
    );
    review.save();

    return res.status(200).send({ review });
  } catch (err) {
    console.log(`댓글 삭제 라우터 에러 ${err}`);

    return res.status(400).send({});
  }
});

/** 대댓글 삭제 */
mainRouter.get("/delReply", async (req, res) => {
  const { commentId, replyId, reviewId } = req.query;

  try {
    let review = await Review.findById(reviewId);
    review.comments.map((comment) => {
      // 대댓글 상위 댓글의 정보
      if (String(comment._id) === String(commentId)) {
        comment.replies = comment.replies.filter(
          (reply) => String(reply._id) !== String(replyId)
        );
      }
    });

    review.save();

    return res.status(200).send({ review });
  } catch (err) {
    console.log(`댓글 삭제 라우터 에러 ${err}`);

    return res.status(400).send({});
  }
});

/** 검색 */
mainRouter.get("/search", async (req, res) => {
  const { userId } = req.session;
  const { keyword } = req.query;

  try {
    const user = await User.findById(userId);

    if (keyword === "전체") {
      const result = await Review.find({});

      return res.status(200).send({ result, user });
    } else {
      const result = await Review.find({
        $or: [
          { category: { $regex: new RegExp(keyword, "i") } },
          { brand: { $regex: new RegExp(keyword, "i") } },
          { product: { $regex: new RegExp(keyword, "i") } },
          { keywords: { $regex: new RegExp(keyword, "i") } },
        ],
      });

      return res.status(200).send({ result, user });
    }
  } catch (err) {
    console.log(`검색 라우터 에러: ${err}`);

    return res.status(404).send({});
  }
});

mainRouter.post("/edit", async (req, res) => {
  const data = req.body;
  const { _id } = data;

  try {
    const review = await Review.findByIdAndUpdate(_id, { ...data });

    return res.status(200).send({ review });
  } catch (err) {
    console.log(`리뷰 수정 라우터 에러 ${err}`);

    return res.status(400).send({});
  }
});

/** 리뷰 삭제 */
mainRouter.get("/delete", async (req, res) => {
  const { userId } = req.session;
  const { reviewId } = req.query;

  try {
    const user = await User.findById(userId);
    user.uploadFiles = user.uploadFiles.filter((review) => review !== reviewId);
    user.save();

    await Review.findByIdAndDelete(reviewId);

    return res.status(200).send({});
  } catch (err) {
    console.log(`리뷰 삭제 라우터 에러 ${err}`);

    return res.status(400).send({});
  }
});

export default mainRouter;

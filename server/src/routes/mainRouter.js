import multer from "multer";
import express from "express";
import "express-session";

import Review from "../models/Review.js";
import User from "../models/User.js";

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
    const files = await Review.find({});
    const { likes } = await User.findById(userId);

    return res.status(200).send({ files, likes });
  } catch {
    console.log("does not exists file");
  }
});

/** 좋아요 */
mainRouter.get("/like", async (req, res) => {
  const { userId } = req.session;
  const { _id, like } = req.query;

  const user = await User.findById(userId);
  const review = await Review.findById(_id);

  if (like === "true") {
    user.likes.push(_id);
    review.likes++;
    user.save();
    review.save();
  } else {
    user.likes = user.likes.filter((id) => String(id) !== String(_id));
    review.likes--;
    user.save();
    review.save();
  }
});

/** 업로드 */
mainRouter.post("/upload", upload.array("images"), async (req, res) => {
  const { userId } = req.session;

  // formdata 를 json 형식 변환하기
  const stringData = JSON.stringify(req.body);
  const parsing = JSON.parse(stringData);
  const dataParsing = JSON.parse(parsing.reviewData);
  const keywordsParsing = JSON.parse(parsing.keywords);

  const review = { userId, ...dataParsing, keywords: keywordsParsing };

  try {
    // Review 데이터베이스 생성
    const uploaded = await Review.create({ ...review });
    // 업로드 한 user 의 정보 받기
    const user = await User.findById(userId);
    // user uploadFiles 에 review 의 고유 id 를 배열에 저장 및 데이터베이스 변경
    user.uploadFiles.unshift(uploaded._id);
    user.save();

    return res.status(200).send({});
  } catch (err) {
    console.log(`업로드 라우터 에러: ${err}`);

    return res.status(400).send({});
  }
});

export default mainRouter;

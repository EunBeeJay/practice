import express from "express";
import bcrypt from "bcrypt";

import User from "../models/User.js";
import Review from "../models/Review.js";
import Question from "../models/Question.js";
import Chat from "../models/Chat.js";

const profileRouter = express.Router();

/** 프로필 정보 */
profileRouter.get("/", async (req, res) => {
  const { userId } = req.session;

  try {
    const user = await User.findById(userId);

    return res.status(200).send({ user });
  } catch (err) {
    console.log(`프로필 라우터 에러 ${err}`);

    return res.status(400).send({});
  }
});

/** 프로필 설정 */
profileRouter.post("/edit", async (req, res) => {
  const { userId } = req.session;
  const { nickname, email, password, profileImg, urlImg } = req.body;

  const user = await User.findById(userId).populate("chatingRooms");

  try {
    // 프로필 이미지 변경하는 경우
    if (profileImg) {
      user.profileImg = profileImg;
      user.img = urlImg;

      if (user.chatingRooms.length) {
        user.chatingRooms.forEach(async (chat) => {
          const chatDB = await Chat.findById(chat._id);

          if (userId === chat.maker) {
            chatDB.user_1.profileImg = urlImg;
          } else {
            chatDB.user_2.profileImg = urlImg;
          }

          chatDB.save();
        });
      }

      user.save();
    }

    // 프로필 설정에서 비밀번호 설정을 하는 경우
    if (password) {
      const newPassword = await bcrypt.hash(password, 5);

      await User.findByIdAndUpdate(userId, {
        nickname,
        email,
        password: newPassword,
      });

      return res.status(200).send();
    }

    await User.findByIdAndUpdate(userId, { nickname, email });

    return res.status(200).send();
  } catch (err) {
    console.log(`프로필 설정 라우터 ${err}`);
  }
});

/** 프로필 내 리뷰 가져오기 */
profileRouter.get("/myReview", async (req, res) => {
  const { userId } = req.session;

  try {
    const myReviews = await Review.find({ userId });
    const { reviewLikes } = await User.findById(userId);

    return res.status(200).send({ userId, myReviews, reviewLikes });
  } catch (err) {
    console.log(`프로필 내 리뷰 라우터 에러 ${err}`);

    return res.status(400).send({});
  }
});

/** 프로필 내 QnA 가져오기 */
profileRouter.get("/myQna", async (req, res) => {
  const { userId } = req.session;

  try {
    const myQnA = await Question.find({ userId });

    return res.status(200).send({ myQnA, userId });
  } catch (err) {
    console.log(`프로필 내 QnA 라우터 에러 ${err}`);

    return res.status(400).send({});
  }
});

/** 프로필 내 도움된 리뷰 가져오기 */
profileRouter.get("/myLikesReview", async (req, res) => {
  const { userId } = req.session;

  try {
    const user = await User.findById(userId);
    const likesArr = user.reviewLikes;

    const { reviewLikes } = await User.findById(userId).populate("reviewLikes");

    return res.status(200).send({ userId, reviewLikes, likesArr });
  } catch (err) {
    console.log(`프로필 내 도움된 리뷰 라우터 에러 ${err}`);

    return res.status(400).send({});
  }
});

/** 다른 사람 프로필 */
profileRouter.get("/anyUser", async (req, res) => {
  const ownId = req.session.userId;
  const { userId } = req.query;

  try {
    const own = await User.findById(ownId);
    const user = await User.findById(userId)
      .populate("uploadFiles")
      .populate("uploadQuestions");

    return res.status(200).send({ user, own });
  } catch (err) {
    console.log(`다른 유저 프로필 라우터 에러 ${err}`);
  }
});

export default profileRouter;

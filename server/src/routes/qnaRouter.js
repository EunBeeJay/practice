import express from "express";
import Question from "../models/Question.js";
import User from "../models/User.js";

const qnaRouter = express.Router();

// qna 페이지
qnaRouter.get("/", async (req, res) => {
  const { userId } = req.session;
  try {
    const questions = await Question.find({});

    res.status(200).send({ questions, userId });
  } catch {
    console.log("qna 페이지 질문이 존재하지 않음.");
  }
});

/** 질문 등록자의 정보 */
qnaRouter.get("/user", async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await User.findById(userId);

    return res.status(200).send({ user });
  } catch (err) {
    console.log(`qna 유저 정보 라우터 에러 ${err}`);

    return res.status(400).send({});
  }
});

// qna 업로드
qnaRouter.post("/upload", async (req, res) => {
  const { userId } = req.session;

  // formdata 를 json 형식으로 변환
  const stringData = JSON.stringify(req.body);
  const parsing = JSON.parse(stringData);
  const questionData = JSON.parse(parsing.data);
  const questionKeywords = JSON.parse(parsing.keywords);

  const qna = { userId, ...questionData, keywords: questionKeywords };

  try {
    // 업로드 한 user 정보 받기
    const user = await User.findById(userId);

    // 고유한 리뷰 ID 생성
    const uniqueId = new Date().getTime().toString(36);

    // qna 데이터베이스 생성
    const uploaded = await Question.create({
      ...qna,
      nickname: user.nickname,
      questionId: uniqueId,
    });
    // user uploadQuestions DB 에 qna 의 고유 id 를 배열에 저장 및 DB 변경
    user.uploadQuestions.unshift(uploaded._id);
    user.save();

    return res.status(200).send({});
  } catch (err) {
    console.log(`질문 업로드 라우터 에러: ${err}`);

    return res.status(400).send({});
  }
});

/** qna 댓글 */
qnaRouter.post("/comment", async (req, res) => {
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
    const question = await Question.findById(_id);
    question.comments.unshift(commentObj);
    question.save();

    const { comments } = question;

    return res.status(200).send({ comments });
  } catch (err) {
    console.log(`리뷰 댓글 라우터 에러: ${err}`);

    return res.status(400).send({});
  }
});

/** qna 대댓글 */
qnaRouter.post("/reply", async (req, res) => {
  const data = req.body;
  const { reply } = data;

  try {
    const question = await Question.findById(data.questionId);
    const comment = question.comments.filter(
      (comment) => String(comment._id) === String(data._id)
    );
    comment[0].replies.push(reply);
    question.save();

    return res.status(200).send({ question });
  } catch (err) {
    console.log(`리뷰 대댓글 라우터 에러 ${err}`);

    return res.status(400).send({});
  }
});

/** 댓글 삭제 */
qnaRouter.get("/delComment", async (req, res) => {
  const { commentId, questionId } = req.query;

  try {
    let question = await Question.findById(questionId);
    question.comments = question.comments.filter(
      (comment) => String(comment._id) !== String(commentId)
    );
    question.save();

    return res.status(200).send({ question });
  } catch (err) {
    console.log(`댓글 삭제 라우터 에러 ${err}`);

    return res.status(400).send({});
  }
});

/** 대댓글 삭제 */
qnaRouter.get("/delReply", async (req, res) => {
  const { commentId, replyId, questionId } = req.query;

  try {
    let question = await Question.findById(questionId);
    question.comments.map((comment) => {
      // 대댓글 상위 댓글의 정보
      if (String(comment._id) === String(commentId)) {
        comment.replies = comment.replies.filter(
          (reply) => String(reply._id) !== String(replyId)
        );
      }
    });

    question.save();

    return res.status(200).send({ question });
  } catch (err) {
    console.log(`댓글 삭제 라우터 에러 ${err}`);

    return res.status(400).send({});
  }
});

/** 질문 수정 */
qnaRouter.post("/edit", async (req, res) => {
  const data = req.body;
  const { questionId } = data;

  try {
    const question = await Question.findByIdAndUpdate(questionId, { ...data });

    return res.status(200).send({ question });
  } catch (err) {
    console.log(`질문 수정 라우터 에러 ${err}`);

    return res.status(400).send({});
  }
});

/** 질문 삭제 */
qnaRouter.get("/delete", async (req, res) => {
  const { userId } = req.session;
  const { questionId } = req.query;

  try {
    const user = await User.findById(userId);
    user.uploadQuestions = user.uploadQuestions.filter(
      (question) => question !== questionId
    );
    user.save();

    await Question.findByIdAndDelete(questionId);

    return res.status(200).send({});
  } catch (err) {
    console.log(`질문 삭제 라우터 에러 ${err}`);

    return res.status(400).send({});
  }
});

export default qnaRouter;

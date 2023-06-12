import mongoose from "mongoose";

/** 질문 정보 */
const question = mongoose.Schema({
  questionId: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  nickname: { type: String },
  title: { type: String },
  detail: { type: String },
  keywords: [{ type: String }],
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      nickname: { type: String },
      img: { type: String },
      comment: { type: String },
      createdAt: { type: String },
      replies: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          nickname: { type: String },
          img: { type: String },
          comment: { type: String },
          createdAt: { type: String },
        },
      ],
    },
  ],
});

const Question = mongoose.model("Question", question);
export default Question;

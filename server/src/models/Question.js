import mongoose from "mongoose";

/** 질문 정보 */
const question = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  questionTitle: { type: String },
  questionDetail: { type: String },
  qusetionComment: [],
});

const Question = mongoose.model("Question", question);
export default Question;

import mongoose from "mongoose";

/** 대댓글 */
const reply = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  nickname: { type: String },
  img: { type: String },
  comment: { type: String },
  createdAt: { type: String },
});

const Reply = mongoose.model("Reply", reply);
export default Reply;

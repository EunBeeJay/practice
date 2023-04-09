import mongoose from "mongoose";

/** user 정보 */
const user = mongoose.Schema({
  email: { type: String },
  password: { type: String },
  nickname: { type: String },
  uploadFiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  uploadQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

const User = mongoose.model("User", user);
export default User;

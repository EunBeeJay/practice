import mongoose from "mongoose";

/** user 정보 */
const user = mongoose.Schema({
  email: { type: String },
  password: { type: String },
  nickname: { type: String },
  profileImg: {
    type: String,
  },
  img: { type: String },
  uploadFiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  uploadQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  reviewLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  questionLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  chatingRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
  common: {
    gender: {
      남자: { type: Boolean, default: false },
      여자: { type: Boolean, default: false },
    },
    households: {
      "1인 가구": { type: Boolean, default: false },
      "2인 가구": { type: Boolean, default: false },
      "3인 가구 이상": { type: Boolean, default: false },
    },
    age: {
      "10대": { type: Boolean, default: false },
      "20대": { type: Boolean, default: false },
      "30대": { type: Boolean, default: false },
      "40대 이상": { type: Boolean, default: false },
    },
    expending: {
      "한 달 지출 10만원 이하": { type: Boolean, default: false },
      "한 달 지출 50만원 이하": { type: Boolean, default: false },
      "한 달 지출 100만원 이하": { type: Boolean, default: false },
      "한 달 지출 100만원 이상": { type: Boolean, default: false },
    },
  },
});

const User = mongoose.model("User", user);
export default User;

import mongoose from "mongoose";

/** 채팅방 */
const chat = mongoose.Schema({
  maker: { type: String },
  user_1: {
    nickname: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    profileImg: { type: String },
  },
  user_2: {
    nickname: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    profileImg: { type: String },
  },
  activate: { type: Boolean, default: true },
});

const Chat = mongoose.model("Chat", chat);
export default Chat;

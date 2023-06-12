import express from "express";
import User from "../models/User.js";
import Chat from "../models/Chat.js";

const chatRouter = express.Router();

// 유저 고유 id 값
chatRouter.get("/channel", async (req, res) => {
  const { userId } = req.session;
  const { pathname } = req.query;

  const chat = await Chat.findById(pathname.split("/")[2]);

  return res.status(200).send({ userId, chat });
});

/** 채팅방 입장 */
chatRouter.get("/room", async (req, res) => {
  const { userId } = req.session;
  const { othersId } = req.query;

  try {
    const ownId = await User.findById(userId);
    const opponentId = await User.findById(othersId);
    let valid = [];

    if (ownId.chatingRooms.length) {
      if (opponentId.chatingRooms.length) {
        valid = ownId?.chatingRooms.map((roomId) => {
          if (opponentId?.chatingRooms.includes(roomId)) return roomId;
        });
      }
    }

    if (valid.length) {
      return res.status(200).send({ roomId: valid[0] });
    } else {
      const chatDB = await Chat.create({
        maker: userId,
        user_1: {
          nickname: ownId.nickname,
          userId: ownId._id,
          profileImg: ownId.img,
        },
        user_2: {
          nickname: opponentId.nickname,
          userId: opponentId._id,
          profileImg: opponentId.img,
        },
      });
      const chatId = chatDB._id;

      ownId.chatingRooms.push(chatId);
      ownId.save();

      opponentId.chatingRooms.push(chatId);
      opponentId.save();

      return res.status(200).send({ roomId: chatId });
    }
  } catch (err) {
    console.log(`채팅방 라우터 에러`);

    return res.status(400).send({});
  }
});

/** 채팅방 나가기 */
chatRouter.get("/exit", async (req, res) => {
  const { userId } = req.session;
  const { roomId } = req.query;

  try {
    const user = await User.findById(userId);
    user.chatingRooms = user.chatingRooms.filter(
      (id) => String(id) !== String(roomId)
    );
    user.save();

    const room = await Chat.findById(roomId);
    room.activate = false;
    room.save();

    return res.status(200).send({});
  } catch (err) {
    console.log(`채팅방 나가기 라우터 에러 ${err}`);
  }
});

// 채팅 페이지의 채팅 진행 중인 상대 내역
chatRouter.get("/", async (req, res) => {
  const { userId } = req.session;

  try {
    const { chatingRooms } = await User.findById(userId).populate(
      "chatingRooms"
    );

    return res.status(200).send({ chatingRooms, userId });
  } catch (err) {
    console.log(`채팅 페이지 라우터 에러 ${err}`);
  }
});

chatRouter.get("/user", async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await User.findById(userId);

    return res.status(200).send({ user });
  } catch (err) {
    console.log(`유저 정보 가져오기 라우터 에러 ${err}`);
  }
});

export default chatRouter;

import express from "express";
import bcrypt from "bcrypt";
import "express-session";

import User from "../models/User.js";

const loginRouter = express.Router();

/** 회원가입 */
loginRouter.post("/sign-up", async (req, res) => {
  const { email, password, nickname } = req.body;

  // 가입된 이메일 유효성 검사
  const accountExist = await User.exists({ email });

  // 비밀번호 암호화
  const encodingPassword = await bcrypt.hash(password, 5);

  // 중복되는 계정이 없는 경우 계정 생성
  if (!accountExist) {
    await User.create({ email, password: encodingPassword, nickname });
    return res.status(200).send({});
  } else {
    return res.status(409).send({ message: "가입된 이메일입니다." });
  }
});

/** 로그인 */
loginRouter.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  // 가입된 이메일 유효성 검사
  const accountExist = await User.exists({ email });

  if (accountExist) {
    const userInfo = await User.findOne({ email });

    // 비밀번호 복호화
    const passwordMatch = await bcrypt.compare(password, userInfo.password);
    if (!passwordMatch)
      return res
        .status(401)
        .send({ type: "password", message: "비밀번호가 일치하지 않습니다." });

    // 로그인 정보를 세션에 저장
    req.session.userId = userInfo._id;

    return res.status(200).send({});
  } else {
    return res
      .status(401)
      .send({ type: "email", message: "이메일이 존재하지 않습니다." });
  }
});

/** 로그아웃 */
loginRouter.get("/logout", async (req, res) => {
  req.session.destroy();
  return res.status(200).send({});
});

/** 사용자 인증 확인 */
loginRouter.get("/loginValid", (req, res) => {
  if (req.session.userId) {
    res.status(200).send({});
  } else {
    res.status(403).send({});
  }
});

export default loginRouter;

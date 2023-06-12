import express from "express";
import session from "express-session";
import cors from "cors";

import "./models/connect.js";

import loginRouter from "./routes/loginRouter.js";
import mainRouter from "./routes/mainRouter.js";
import qnaRouter from "./routes/qnaRouter.js";
import chatRouter from "./routes/chatRouter.js";
import profileRouter from "./routes/profileRouter.js";

// dotenv 파일은 무조건 루트 경로
import dotenv from "dotenv";
dotenv.config();

const app = express();

const PORT = 4000;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/user", loginRouter);
app.use("/main", mainRouter);
app.use("/qna", qnaRouter);
app.use("/chat", chatRouter);
app.use("/profile", profileRouter);

app.use("/public", express.static("public"));

app.listen(PORT, () => {
  console.log("Listen on 4000 port");
});

import express from "express";
import session from "express-session";
import fileUpload from "express-fileupload";
import cors from "cors";

import "./models/connect.js";

import loginRouter from "./routes/loginRouter.js";
import mainRouter from "./routes/mainRouter.js";

// dotenv 파일은 무조건 루트 경로
import dotenv from "dotenv";
import qnaRouter from "./routes/qnaRouter.js";
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
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/user", loginRouter);
app.use("/main", mainRouter);
app.use("/qna", qnaRouter);

app.use("/public", express.static("public"));

app.listen(PORT, () => {
  console.log("Listen on 4000 port");
});

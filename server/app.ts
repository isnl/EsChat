import express from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import { wechatRouter, userRouter, chatRouter, homeRouter } from "./src/routes";

const app = express();

// express允许跨域
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json({ limit: "2mb" }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "clientDist")));

app.use("/wechat", wechatRouter);
app.use("/", homeRouter);
app.use("/chat", chatRouter);
app.use("/user", userRouter);

app.set("port", 3100); // 设定监听端口

//启动监听
app.listen(app.get("port"), function () {
  console.log("Express server listening http://localhost:3100");
});

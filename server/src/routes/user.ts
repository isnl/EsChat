import express from "express";
import { onUserCheck, randomLetter, today, validateAvatar } from "src/utils";
import { userDB, uscDB } from "src/lowdb";
import moment from "moment";
const router = express.Router();

onUserCheck(router);

router.get("/", async function (req: any, res) {
  const { openId } = req.auth;
  await userDB.read();
  await uscDB.read();
  const data = userDB.data.find(item => item.openId === openId);
  const current = uscDB.data.find(
    item =>
      item.user_id === openId && item.date === moment().format("YYYY-MM-DD")
  );

  res.json({
    code: 200,
    data: {
      ...data,
      daily_limit: process.env.DAILY_LIMIT,
      max_length: process.env.MAX_LENGTH,
      current: current ? current.count : 0,
    },
  });
});
router.put("/", async function (req: any, res) {
  const { openId } = req.auth;
  let { name, avatar } = req.body;
  try {
    await userDB.read();
    let index = userDB.data.findIndex(item => item.openId === openId);
    if (index !== -1) {
      const info = userDB.data[index];
      avatar = avatar ? validateAvatar(avatar) : info.avatar;
      name = name ? name.trim().substring(0, 15) : info.name;
      userDB.data[index].name = name;
      userDB.data[index].avatar = avatar;
      await userDB.write();
    }
    res.json({
      code: 200,
    });
  } catch (error) {
    res.status(400).json({
      code: 10003,
      message: "用户信息更新失败" + error.message,
    });
  }
});
export default router;

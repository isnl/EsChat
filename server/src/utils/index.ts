import type { Router } from "express";
import moment from "moment";
import { AVATARS } from "src/constant";
import { expressjwt } from "express-jwt";

/**
 * 随机字符
 * @param len
 * @returns
 */
export function randomLetter(len: number) {
  const letters = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let str = "";
  for (let i = 0; i < len; i++) {
    str += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return str;
}

// 随机生成6位数验证码
export function randomCode() {
  return Math.random().toString().slice(-6);
}
/**
 * 获取随机头像id
 * @returns
 */
export function getRandomAvatar() {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}
/**
 * 随机昵称
 * @returns
 */
export function getRandomName() {
  const name = Math.random().toString(36).slice(-5).toUpperCase();
  return `${name}-ChatGPTer`;
}
/**
 *
 * @returns 当天日期
 */
export function today() {
  return moment().format("YYYY-MM-DD");
}
/**
 * 头像校验
 * @param avatar
 * @returns
 */
export function validateAvatar(avatar) {
  return AVATARS.includes(avatar) ? avatar : "";
}

/**
 * 用户权限校验
 * @param router
 */
export function onUserCheck(router: Router) {
  router.use(
    expressjwt({
      secret: process.env.JWT_SECRET_KEY,
      algorithms: ["HS256"],
    })
  );
  router.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
      res.status(401).json({
        code: 401,
        msg: "token无效或已过期",
      });
    } else {
      next(err);
    }
  });
}

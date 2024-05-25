import { ChatGPTAPI } from "chatgpt";

import moment from "moment";
import { uscDB } from "src/lowdb";
export default router => {
  const ErrorCodeMessage: Record<string, string> = {
    401: "[OpenAI] 提供错误的API密钥 | Incorrect API key provided",
    403: "[OpenAI] 服务器拒绝访问，请稍后再试 | Server refused to access, please try again later",
    429: "[OpenAI] 1分钟内请求超过限制，限制 3 / min | Rate limit reached for default-gpt-3.5-turbo in organization",
    502: "[OpenAI] 错误的网关 |  Bad Gateway",
    503: "[OpenAI] 服务器繁忙，请稍后再试 | Server is busy, please try again later",
    504: "[OpenAI] 网关超时 | Gateway Time-out",
    500: "[OpenAI] 服务器繁忙，请稍后再试 | Internal Server Error",
  };

  router.post("/gpt3", async function (req: any, res) {
    const api = new ChatGPTAPI({
      apiKey: process.env.GPT3_API_KEY,
      apiBaseUrl: process.env.GPT3_BASE_URL,
      completionParams: {
        model: process.env.GPT3_MODEL,
      },
    });
    const { message, parentMessageId } = req.body;
    const { openId } = req.auth;

    if (message.length > process.env.MAX_LENGTH) {
      res.status(400).json({
        code: 10001,
        message: `消息长度不能超过${process.env.MAX_LENGTH}字符`,
      });
      return;
    }

    await uscDB.read();
    const date = moment().format("YYYY-MM-DD");
    const uscInfo = await uscDB.data.find(
      item => item.date === date && item.user_id === openId
    );

    if (!uscInfo) {
      uscDB.data.push({
        user_id: openId,
        date,
        history: [moment().format("HH:mm:ss")],
        count: 1,
      });
    } else {
      if (uscInfo.count >= Number(process.env.DAILY_LIMIT)) {
        res.status(400).json({
          code: 10002,
          message: "今日服务调用次数已达上限",
        });
        return;
      }
      uscInfo.count += 1;
      uscInfo.history.push(moment().format("HH:mm:ss"));
    }
    await uscDB.write();

    try {
      let options = { parentMessageId };
      res.setHeader("Content-type", "application/octet-stream");
      let firstChunk = true;
      await api.sendMessage(message, {
        ...options,
        onProgress: chat => {
          if (!chat.delta) return;
          res.write(
            firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`
          );
          firstChunk = false;
        },
      });
      res.end();
    } catch (error) {
      await uscDB.read();
      const uscInfo = await uscDB.data.find(
        item => item.date === date && item.user_id === openId
      );
      uscInfo.count -= 1;
      uscInfo.history.pop();
      await uscDB.write();
      const code = error.statusCode;
      if (Reflect.has(ErrorCodeMessage, code)) {
        res.status(400).json({
          code,
          message: ErrorCodeMessage[code],
        });
      } else {
        res.status(400).json({
          code: 10003,
          message: "服务调用失败：" + error.message,
        });
      }
    }
  });
};

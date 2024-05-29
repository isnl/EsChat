// node_modules/tsup/assets/esm_shims.js
import { fileURLToPath } from "url";
import path from "path";
var getFilename = () => fileURLToPath(import.meta.url);
var getDirname = () => path.dirname(getFilename());
var __dirname = /* @__PURE__ */ getDirname();

// app.ts
import express5 from "express";
import path2 from "path";
import cors from "cors";
import bodyParser from "body-parser";

// src/routes/wechat.ts
import express from "express";
import jsSHA from "jssha";
import { parseString } from "xml2js";
import jwt from "jsonwebtoken";

// src/store/index.ts
import NodeCache from "node-cache";
var myCache = new NodeCache();
var store_default = myCache;

// src/utils/index.ts
import moment from "moment";

// src/constant/index.ts
var AVATARS = [
  "1F0CF",
  "1F344",
  "1F345",
  "1F346",
  "1F347",
  "1F348",
  "1F349",
  "1F351",
  "1F352",
  "1F353",
  "1F354",
  "1F367",
  "1F368",
  "1F369",
  "1F370",
  "1F371",
  "1F379",
  "1F380",
  "1F381",
  "1F382",
  "1F383",
  "1F384",
  "1F385-1F3FE",
  "1F386",
  "1F387",
  "1F388",
  "1F389",
  "1F391",
  "1F392",
  "1F3A0",
  "1F3A1",
  "1F3A2",
  "1F3A7",
  "1F3A8",
  "1F3A9",
  "1F3AF",
  "1F3B4",
  "1F3BD",
  "1F3BE",
  "1F3BF",
  "1F3C0",
  "1F3DA",
  "1F3DC",
  "1F3DD",
  "1F3E0",
  "1F3F5",
  "1F3FA",
  "1F405",
  "1F407",
  "1F408",
  "1F412",
  "1F413",
  "1F415",
  "1F419",
  "1F422",
  "1F425",
  "1F431-200D-1F4BB",
  "1F431",
  "1F432",
  "1F433",
  "1F434",
  "1F435",
  "1F436",
  "1F437",
  "1F438",
  "1F439",
  "1F4AA-1F3FB",
  "1F4E6",
  "1F4EE",
  "1F4EF",
  "1F926-200D-2642-FE0F",
  "1F932",
  "1F934",
  "1F935",
  "1F936",
  "1F937-1F3FB-200D-2642-FE0F",
  "1F937-1F3FC",
  "1F937-200D-2642-FE0F",
  "1F955",
  "1F957",
  "262E",
  "262F",
  "E010",
  "E044",
  "E045",
  "E049",
  "E050",
  "E053",
  "E054",
  "E05C",
  "E097",
  "E09F",
  "E0AA",
  "E0AB",
  "E0AC-200D-2640-FE0F",
  "E0C0",
  "E0C4",
  "E0C7",
  "E0FF",
  "E143",
  "E1C2",
  "E1C9",
  "E1CA",
  "E20A",
  "E20B",
  "E20C",
  "E20D",
  "E305",
  "E306",
  "E307",
  "E30C",
  "E30D",
  "E340",
  "E341"
];

// src/utils/index.ts
import { expressjwt } from "express-jwt";
function randomCode() {
  return Math.random().toString().slice(-6);
}
function getRandomAvatar() {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}
function getRandomName() {
  const name = Math.random().toString(36).slice(-5).toUpperCase();
  return `${name}-ChatGPTer`;
}
function validateAvatar(avatar) {
  return AVATARS.includes(avatar) ? avatar : "";
}
function onUserCheck(router5) {
  router5.use(
    expressjwt({
      secret: process.env.JWT_SECRET_KEY,
      algorithms: ["HS256"]
    })
  );
  router5.use(function(err, req, res, next) {
    if (err.name === "UnauthorizedError") {
      res.status(401).json({
        code: 401,
        msg: "token\u65E0\u6548\u6216\u5DF2\u8FC7\u671F"
      });
    } else {
      next(err);
    }
  });
}

// src/lowdb/user.ts
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";
var user = new Low(
  new JSONFile(join(process.cwd(), "/db/users.json")),
  []
);
var user_default = user;

// src/lowdb/userServiceCall.ts
import { Low as Low2 } from "lowdb";
import { JSONFile as JSONFile2 } from "lowdb/node";
import { join as join2 } from "path";
var userServiceCall_default = new Low2(
  new JSONFile2(join2(process.cwd(), "/db/userServiceCalls.json")),
  []
);

// src/routes/wechat.ts
import { nanoid } from "nanoid";
import moment2 from "moment";
var router = express.Router();
router.get("/", (req, res, next) => {
  const token = process.env.WECHAT_TOKEN;
  const { signature, timestamp, nonce, echostr } = req.query;
  const array = [token, timestamp, nonce].sort();
  const tempStr = array.join("");
  const shaObj = new jsSHA("SHA-1", "TEXT");
  shaObj.update(tempStr);
  const scyptoString = shaObj.getHash("HEX");
  if (signature === scyptoString) {
    console.log("\u9A8C\u8BC1\u6210\u529F");
    res.send(echostr);
  } else {
    console.log("\u9A8C\u8BC1\u5931\u8D25");
    res.send("\u9A8C\u8BC1\u5931\u8D25");
  }
});
function textMsg(toUser, fromUser, content) {
  let resultXml = "<xml><ToUserName><![CDATA[" + fromUser + "]]></ToUserName>";
  resultXml += "<FromUserName><![CDATA[" + toUser + "]]></FromUserName>";
  resultXml += "<CreateTime>" + (/* @__PURE__ */ new Date()).getTime() + "</CreateTime>";
  resultXml += "<MsgType><![CDATA[text]]></MsgType>";
  resultXml += "<Content><![CDATA[" + content + "]]></Content></xml>";
  return resultXml;
}
router.get("/verify", async function(req, res) {
  const { code = "", loginType } = req.query;
  const openId = loginType === "authCode" ? code : store_default.get(code);
  if (openId) {
    await user_default.read();
    const openIdInfo = user_default.data.find((item) => item.openId === openId);
    if (loginType === "authCode" && !openIdInfo) {
      res.json({
        code: 400,
        msg: "\u767B\u5F55\u5931\u8D25\uFF0C\u6388\u6743\u7801\u9519\u8BEF\uFF01-_-"
      });
      return;
    }
    const tokenStr = jwt.sign({ openId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d"
    });
    res.json({
      code: 200,
      data: tokenStr
    });
    if (!openIdInfo) {
      await user_default.read();
      await user_default.data.push({
        openId,
        id: nanoid(),
        avatar: getRandomAvatar(),
        name: getRandomName(),
        createdAt: moment2().format("YYYY-MM-DD HH:mm:ss")
      });
      await user_default.write();
    }
  } else {
    res.json({
      code: 400,
      msg: "\u60A8\u8F93\u5165\u7684\u9A8C\u8BC1\u7801\u6709\u8BEF\u6216\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165\uFF01-_-"
    });
  }
});
router.get("/code", function(req, res) {
  store_default.set("1b7sm2", "123456", 1 * 60 * 5);
  res.json({
    code: 200
  });
});
router.post("/", function(req, res) {
  var buffer = [];
  req.on("data", function(data) {
    buffer.push(data);
  });
  req.on("end", function() {
    var msgXml = Buffer.concat(buffer).toString("utf-8");
    parseString(msgXml, { explicitArray: false }, function(err, result) {
      if (err)
        throw err;
      result = result.xml;
      const { ToUserName, FromUserName, MsgType, Content } = result;
      if (MsgType === "text") {
        if (Content === "\u767B\u5F55" || Content === "\u767B\u9646" || Content === "\u9A8C\u8BC1\u7801") {
          const code = randomCode();
          store_default.set(code, FromUserName, 1 * 60 * 5);
          const sendXml = textMsg(
            ToUserName,
            FromUserName,
            `\u60A8\u7684\u767B\u5F55\u9A8C\u8BC1\u7801\u662F\uFF1A${code}  ,  \u6709\u6548\u671F\u4E3A5\u5206\u949F\u3002`
          );
          res.send(sendXml);
        }
      }
    });
  });
});
var wechat_default = router;

// src/routes/user.ts
import express2 from "express";
import moment3 from "moment";
var router2 = express2.Router();
onUserCheck(router2);
router2.get("/", async function(req, res) {
  const { openId } = req.auth;
  await user_default.read();
  await userServiceCall_default.read();
  const data = user_default.data.find((item) => item.openId === openId);
  const current = userServiceCall_default.data.find(
    (item) => item.user_id === openId && item.date === moment3().format("YYYY-MM-DD")
  );
  res.json({
    code: 200,
    data: {
      ...data,
      daily_limit: process.env.DAILY_LIMIT,
      max_length: process.env.MAX_LENGTH,
      current: current ? current.count : 0
    }
  });
});
router2.put("/", async function(req, res) {
  const { openId } = req.auth;
  let { name, avatar } = req.body;
  try {
    await user_default.read();
    let index = user_default.data.findIndex((item) => item.openId === openId);
    if (index !== -1) {
      const info = user_default.data[index];
      avatar = avatar ? validateAvatar(avatar) : info.avatar;
      name = name ? name.trim().substring(0, 15) : info.name;
      user_default.data[index].name = name;
      user_default.data[index].avatar = avatar;
      await user_default.write();
    }
    res.json({
      code: 200
    });
  } catch (error) {
    res.status(400).json({
      code: 10003,
      message: "\u7528\u6237\u4FE1\u606F\u66F4\u65B0\u5931\u8D25" + error.message
    });
  }
});
var user_default2 = router2;

// src/routes/chat.ts
import express3 from "express";

// src/routes/chat/tyqw.ts
import { TongYiAPI } from "ty-sdk";
import moment4 from "moment";
var tyqw_default = (router5) => {
  const ErrorCodeMessage = {
    InvalidParameter: "\u63A5\u53E3\u8C03\u7528\u53C2\u6570\u4E0D\u5408\u6CD5 | Required parameter(s) missing or invalid, please check the request parameters.",
    DataInspectionFailed: "\u6570\u636E\u68C0\u67E5\u9519\u8BEF\uFF0C\u8F93\u5165\u6216\u8005\u8F93\u51FA\u5305\u542B\u7591\u4F3C\u654F\u611F\u5185\u5BB9\u88AB\u7EFF\u7F51\u62E6\u622A | Input or output data may contain inappropriate content.",
    "BadRequest.EmptyInput": "\u8BF7\u6C42\u7684\u8F93\u5165\u4E0D\u80FD\u4E3A\u7A7A | Required input parameter missing from request.",
    "BadRequest.EmptyParameters": '\u8BF7\u6C42\u7684\u53C2\u6570"parameters"\u4E0D\u80FD\u4E3A\u7A7A | Required parameter "parameters" missing from request.',
    "BadRequest.EmptyModel": '\u8BF7\u6C42\u8F93\u5165\u7684\u6A21\u578B\u4E0D\u80FD\u4E3A\u7A7A | Required parameter "model" missing from request.',
    InvalidURL: "\u8BF7\u6C42\u7684 URL \u9519\u8BEF | Invalid URL provided in your request.",
    Arrearage: "\u5BA2\u6237\u8D26\u6237\u56E0\u4E3A\u6B20\u8D39\u800C\u88AB\u62D2\u7EDD\u8BBF\u95EE | Access denied, please make sure your account is in good standing.",
    UnsupportedOperation: "\u5173\u8054\u7684\u5BF9\u8C61\u4E0D\u652F\u6301\u8BE5\u64CD\u4F5C\uFF08\u53EF\u4EE5\u6839\u636E\u5B9E\u9645\u60C5\u51B5\u4FEE\u6539\uFF09 | The operation is unsupported on the referee object.",
    FlowNotPublished: "\u6D41\u7A0B\u672A\u53D1\u5E03\uFF0C\u8BF7\u53D1\u5E03\u6D41\u7A0B\u540E\u518D\u91CD\u8BD5\u3002 | Flow has not published yet, please publish flow and try again.",
    InvalidSchema: "\u8BF7\u8F93\u5165\u6570\u636E\u5E93Schema\u4FE1\u606F\u3002 | Database schema is invalid for text2sql.",
    InvalidSchemaFormat: "\u8F93\u5165\u6570\u636E\u8868\u4FE1\u606F\u683C\u5F0F\u5F02\u5E38\u3002 | Database schema format is invalid for text2sql.",
    FaqRuleBlocked: "\u547D\u4E2DFAQ\u89C4\u5219\u5E72\u9884\u6A21\u5757\u3002 | Input or output data is blocked by faq rule.",
    CustomRoleBlocked: "\u8BF7\u6C42\u6216\u54CD\u5E94\u5185\u5BB9\u6CA1\u6709\u901A\u8FC7\u81EA\u5B9A\u4E49\u7B56\u7565\u3002 | Input or output data may contain inappropriate content with custom rule.",
    InvalidApiKey: "\u8BF7\u6C42\u4E2D\u7684 ApiKey \u9519\u8BEF | Invalid API-key provided.",
    AccessDenied: "\u65E0\u6743\u8BBF\u95EE\u6B64 API\uFF0C\u6BD4\u5982\u4E0D\u5728\u9080\u6D4B\u4E2D | Access denied.",
    "AccessDenied.Unpurchased": "\u5BA2\u6237\u6CA1\u6709\u5F00\u901A\u6B64\u5546\u54C1 | Access to model denied. Please make sure you are eligible for using the model.",
    WorkSpaceNotFound: "\u7528\u6237\u7A7A\u95F4\u4FE1\u606F\u4E0D\u5B58\u5728\u3002 | WorkSpace can not be found.",
    ModelNotFound: "\u5F53\u524D\u8BBF\u95EE\u7684\u6A21\u578B\u4E0D\u5B58\u5728\u3002 | Model can not be found.",
    RequestTimeOut: "\u8BF7\u6C42\u8D85\u65F6\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5\u3002 | Request timed out, please try again later.",
    "BadRequest.TooLarge": "\u63A5\u5165\u5C42\u7F51\u5173\u8FD4\u56DE\u8BF7\u6C42\u4F53\u8FC7\u5927\u9519\u8BEF\u3002 | Payload Too Large",
    "BadRequest.InputDownloadFailed": "\u4E0B\u8F7D\u8F93\u5165\u6587\u4EF6\u5931\u8D25\u3002 | Failed to download the input file: xxx",
    "BadRequest.UnsupportedFileFormat": "\u8F93\u5165\u6587\u4EF6\u7684\u683C\u5F0F\u4E0D\u652F\u6301\u3002 | Input file format is not supported.",
    Throttling: "\u63A5\u53E3\u8C03\u7528\u89E6\u53D1\u9650\u6D41\u3002 | Requests throttling triggered.",
    "Throttling.RateQuota": "\u8C03\u7528\u9891\u6B21\u89E6\u53D1\u9650\u6D41\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5\u3002 | Requests rate limit exceeded, please try again later.",
    "Throttling.AllocationQuota": "\u4E00\u6BB5\u65F6\u95F4\u8C03\u7528\u91CF\u89E6\u53D1\u9650\u6D41\uFF0C\u8BF7\u589E\u52A0\u914D\u989D\u9650\u5236\u3002 | Allocated quota exceeded, please increase your quota limit.",
    "AllocationQuota.FreeExceeded": "\u514D\u8D39\u989D\u5EA6\u5DF2\u7ECF\u8017\u5C3D\uFF0C\u8BF7\u5F00\u901A\u8BA1\u8D39\u8BBF\u95EE\u3002 | Free allocated quota exceeded.",
    PrepaidBillOverdue: "\u4E1A\u52A1\u7A7A\u95F4\u9884\u4ED8\u8D39\u8D26\u5355\u5230\u671F\u3002 | The prepaid bill is overdue.",
    PostpaidBillOverdue: "\u6A21\u578B\u63A8\u7406\u5546\u54C1\u5DF2\u5931\u6548\u3002 | The postpaid bill is overdue.",
    CommodityNotPurchased: "\u4E1A\u52A1\u7A7A\u95F4\u672A\u8BA2\u8D2D\u3002 | Commodity has not purchased yet.",
    InternalError: "\u5185\u90E8\u9519\u8BEF\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5\u6216\u8054\u7CFB\u5BA2\u670D\u3002 | An internal error has occurred, please try again later or contact service support.",
    "InternalError.Algo": "\u5185\u90E8\u7B97\u6CD5\u6267\u884C\u9519\u8BEF\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5\u6216\u8054\u7CFB\u5BA2\u670D\u3002 | An internal error has occurred during execution, please try again later or contact service support.",
    SystemError: "\u7CFB\u7EDF\u9519\u8BEF\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5\u3002 | An system error has occurred, please try again later.",
    "InternalError.Timeout": "\u5185\u90E8\u8D85\u65F6\u9519\u8BEF\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5\u6216\u8054\u7CFB\u5BA2\u670D\u3002 | An internal timeout error has occurred during execution, please try again later or contact service support.",
    RewriteFailed: "\u8C03\u7528\u6539\u5199prompt\u7684\u5927\u6A21\u578B\u5931\u8D25\u3002 | Failed to rewrite content for prompt.",
    RetrivalFailed: "\u6587\u6863\u68C0\u7D22\u5931\u8D25\u3002 | Failed to retrieve data from documents.",
    AppProcessFailed: "\u5E94\u7528\u6D41\u7A0B\u5904\u7406\u5931\u8D25\u3002 | Failed to proceed application request.",
    ModelServiceFailed: "\u6A21\u578B\u670D\u52A1\u8C03\u7528\u5931\u8D25\u3002 | Failed to request model service.",
    InvokePluginFailed: "\u63D2\u4EF6\u8C03\u7528\u5931\u8D25\u3002 | Failed to invoke plugin.",
    ModelUnavailable: "\u6A21\u578B\u6682\u65F6\u65E0\u6CD5\u63D0\u4F9B\u670D\u52A1\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5\u3002 | Model is unavailable, please try again later."
  };
  router5.post("/tyqw", async function(req, res) {
    const api = new TongYiAPI({
      apiKey: process.env.TY_API_KEY,
      model: process.env.TY_MODEL || "qwen-plus"
    });
    const { message, parentMessageId } = req.body;
    const { openId } = req.auth;
    if (message.length > process.env.MAX_LENGTH) {
      res.status(400).json({
        code: 10001,
        message: `\u6D88\u606F\u957F\u5EA6\u4E0D\u80FD\u8D85\u8FC7${process.env.MAX_LENGTH}\u5B57\u7B26`
      });
      return;
    }
    await userServiceCall_default.read();
    const date = moment4().format("YYYY-MM-DD");
    const uscInfo = await userServiceCall_default.data.find(
      (item) => item.date === date && item.user_id === openId
    );
    if (!uscInfo) {
      userServiceCall_default.data.push({
        user_id: openId,
        date,
        history: [moment4().format("HH:mm:ss")],
        count: 1
      });
    } else {
      if (uscInfo.count >= Number(process.env.DAILY_LIMIT)) {
        res.status(400).json({
          code: 10002,
          message: "\u4ECA\u65E5\u670D\u52A1\u8C03\u7528\u6B21\u6570\u5DF2\u8FBE\u4E0A\u9650"
        });
        return;
      }
      uscInfo.count += 1;
      uscInfo.history.push(moment4().format("HH:mm:ss"));
    }
    await userServiceCall_default.write();
    try {
      let options = { parentMessageId };
      res.setHeader("Content-type", "application/octet-stream");
      let firstChunk = true;
      const json = await api.sendMessage(message, {
        ...options,
        onProgress: (chat) => {
          if (!chat.delta)
            return;
          res.write(
            firstChunk ? JSON.stringify(chat) : `
${JSON.stringify(chat)}`
          );
          firstChunk = false;
        }
      });
      res.end();
    } catch (error) {
      await userServiceCall_default.read();
      const uscInfo2 = await userServiceCall_default.data.find(
        (item) => item.date === date && item.user_id === openId
      );
      uscInfo2.count -= 1;
      uscInfo2.history.pop();
      await userServiceCall_default.write();
      const code = error.statusCode;
      if (Reflect.has(ErrorCodeMessage, code)) {
        res.status(400).json({
          code,
          message: ErrorCodeMessage[code]
        });
      } else {
        res.status(400).json({
          code: 10003,
          message: "\u670D\u52A1\u8C03\u7528\u5931\u8D25\uFF1A" + error.message
        });
      }
    }
  });
};

// src/routes/chat/gpt3.ts
import { ChatGPTAPI } from "chatgpt";
import moment5 from "moment";
var gpt3_default = (router5) => {
  const ErrorCodeMessage = {
    401: "[OpenAI] \u63D0\u4F9B\u9519\u8BEF\u7684API\u5BC6\u94A5 | Incorrect API key provided",
    403: "[OpenAI] \u670D\u52A1\u5668\u62D2\u7EDD\u8BBF\u95EE\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5 | Server refused to access, please try again later",
    429: "[OpenAI] 1\u5206\u949F\u5185\u8BF7\u6C42\u8D85\u8FC7\u9650\u5236\uFF0C\u9650\u5236 3 / min | Rate limit reached for default-gpt-3.5-turbo in organization",
    502: "[OpenAI] \u9519\u8BEF\u7684\u7F51\u5173 |  Bad Gateway",
    503: "[OpenAI] \u670D\u52A1\u5668\u7E41\u5FD9\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5 | Server is busy, please try again later",
    504: "[OpenAI] \u7F51\u5173\u8D85\u65F6 | Gateway Time-out",
    500: "[OpenAI] \u670D\u52A1\u5668\u7E41\u5FD9\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5 | Internal Server Error"
  };
  router5.post("/gpt3", async function(req, res) {
    const api = new ChatGPTAPI({
      apiKey: process.env.GPT3_API_KEY,
      apiBaseUrl: process.env.GPT3_BASE_URL,
      completionParams: {
        model: process.env.GPT3_MODEL
      }
    });
    const { message, parentMessageId } = req.body;
    const { openId } = req.auth;
    if (message.length > process.env.MAX_LENGTH) {
      res.status(400).json({
        code: 10001,
        message: `\u6D88\u606F\u957F\u5EA6\u4E0D\u80FD\u8D85\u8FC7${process.env.MAX_LENGTH}\u5B57\u7B26`
      });
      return;
    }
    await userServiceCall_default.read();
    const date = moment5().format("YYYY-MM-DD");
    const uscInfo = await userServiceCall_default.data.find(
      (item) => item.date === date && item.user_id === openId
    );
    if (!uscInfo) {
      userServiceCall_default.data.push({
        user_id: openId,
        date,
        history: [moment5().format("HH:mm:ss")],
        count: 1
      });
    } else {
      if (uscInfo.count >= Number(process.env.DAILY_LIMIT)) {
        res.status(400).json({
          code: 10002,
          message: "\u4ECA\u65E5\u670D\u52A1\u8C03\u7528\u6B21\u6570\u5DF2\u8FBE\u4E0A\u9650"
        });
        return;
      }
      uscInfo.count += 1;
      uscInfo.history.push(moment5().format("HH:mm:ss"));
    }
    await userServiceCall_default.write();
    try {
      let options = { parentMessageId };
      res.setHeader("Content-type", "application/octet-stream");
      let firstChunk = true;
      await api.sendMessage(message, {
        ...options,
        onProgress: (chat) => {
          if (!chat.delta)
            return;
          res.write(
            firstChunk ? JSON.stringify(chat) : `
${JSON.stringify(chat)}`
          );
          firstChunk = false;
        }
      });
      res.end();
    } catch (error) {
      await userServiceCall_default.read();
      const uscInfo2 = await userServiceCall_default.data.find(
        (item) => item.date === date && item.user_id === openId
      );
      uscInfo2.count -= 1;
      uscInfo2.history.pop();
      await userServiceCall_default.write();
      const code = error.statusCode;
      if (Reflect.has(ErrorCodeMessage, code)) {
        res.status(400).json({
          code,
          message: ErrorCodeMessage[code]
        });
      } else {
        res.status(400).json({
          code: 10003,
          message: "\u670D\u52A1\u8C03\u7528\u5931\u8D25\uFF1A" + error.message
        });
      }
    }
  });
};

// src/routes/chat.ts
var router3 = express3.Router();
onUserCheck(router3);
tyqw_default(router3);
gpt3_default(router3);
router3.post("/", async function(req, res) {
  res.redirect(307, process.env.TY_API_KEY ? "/chat/tyqw" : "/chat/gpt3");
});
var chat_default = router3;

// src/routes/home.ts
import express4 from "express";
var router4 = express4.Router();
onUserCheck(router4);
router4.get("/status", async function(req, res) {
  res.json({
    code: 200
  });
});
var home_default = router4;

// app.ts
var app = express5();
app.use(
  cors({
    origin: "*"
  })
);
app.use(bodyParser.json({ limit: "2mb" }));
app.use(express5.json());
app.use(express5.static(path2.join(__dirname, "clientDist")));
app.use("/wechat", wechat_default);
app.use("/", home_default);
app.use("/chat", chat_default);
app.use("/user", user_default2);
app.set("port", 3100);
app.listen(app.get("port"), function() {
  console.log("Express server listening http://localhost:3100");
});
//# sourceMappingURL=app.mjs.map
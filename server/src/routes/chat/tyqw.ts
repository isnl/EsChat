import { TongYiAPI } from "ty-sdk";

import { uscDB } from "src/lowdb";
import moment from "moment";

export default router => {
  const ErrorCodeMessage: Record<string, string> = {
    InvalidParameter:
      "接口调用参数不合法 | Required parameter(s) missing or invalid, please check the request parameters.",
    DataInspectionFailed:
      "数据检查错误，输入或者输出包含疑似敏感内容被绿网拦截 | Input or output data may contain inappropriate content.",
    "BadRequest.EmptyInput":
      "请求的输入不能为空 | Required input parameter missing from request.",
    "BadRequest.EmptyParameters":
      '请求的参数"parameters"不能为空 | Required parameter "parameters" missing from request.',
    "BadRequest.EmptyModel":
      '请求输入的模型不能为空 | Required parameter "model" missing from request.',
    InvalidURL: "请求的 URL 错误 | Invalid URL provided in your request.",
    Arrearage:
      "客户账户因为欠费而被拒绝访问 | Access denied, please make sure your account is in good standing.",
    UnsupportedOperation:
      "关联的对象不支持该操作（可以根据实际情况修改） | The operation is unsupported on the referee object.",
    FlowNotPublished:
      "流程未发布，请发布流程后再重试。 | Flow has not published yet, please publish flow and try again.",
    InvalidSchema:
      "请输入数据库Schema信息。 | Database schema is invalid for text2sql.",
    InvalidSchemaFormat:
      "输入数据表信息格式异常。 | Database schema format is invalid for text2sql.",
    FaqRuleBlocked:
      "命中FAQ规则干预模块。 | Input or output data is blocked by faq rule.",
    CustomRoleBlocked:
      "请求或响应内容没有通过自定义策略。 | Input or output data may contain inappropriate content with custom rule.",
    InvalidApiKey: "请求中的 ApiKey 错误 | Invalid API-key provided.",
    AccessDenied: "无权访问此 API，比如不在邀测中 | Access denied.",
    "AccessDenied.Unpurchased":
      "客户没有开通此商品 | Access to model denied. Please make sure you are eligible for using the model.",
    WorkSpaceNotFound: "用户空间信息不存在。 | WorkSpace can not be found.",
    ModelNotFound: "当前访问的模型不存在。 | Model can not be found.",
    RequestTimeOut:
      "请求超时，请稍后再试。 | Request timed out, please try again later.",
    "BadRequest.TooLarge": "接入层网关返回请求体过大错误。 | Payload Too Large",
    "BadRequest.InputDownloadFailed":
      "下载输入文件失败。 | Failed to download the input file: xxx",
    "BadRequest.UnsupportedFileFormat":
      "输入文件的格式不支持。 | Input file format is not supported.",
    Throttling: "接口调用触发限流。 | Requests throttling triggered.",
    "Throttling.RateQuota":
      "调用频次触发限流，请稍后再试。 | Requests rate limit exceeded, please try again later.",
    "Throttling.AllocationQuota":
      "一段时间调用量触发限流，请增加配额限制。 | Allocated quota exceeded, please increase your quota limit.",
    "AllocationQuota.FreeExceeded":
      "免费额度已经耗尽，请开通计费访问。 | Free allocated quota exceeded.",
    PrepaidBillOverdue:
      "业务空间预付费账单到期。 | The prepaid bill is overdue.",
    PostpaidBillOverdue: "模型推理商品已失效。 | The postpaid bill is overdue.",
    CommodityNotPurchased:
      "业务空间未订购。 | Commodity has not purchased yet.",
    InternalError:
      "内部错误，请稍后再试或联系客服。 | An internal error has occurred, please try again later or contact service support.",
    "InternalError.Algo":
      "内部算法执行错误，请稍后再试或联系客服。 | An internal error has occurred during execution, please try again later or contact service support.",
    SystemError:
      "系统错误，请稍后再试。 | An system error has occurred, please try again later.",
    "InternalError.Timeout":
      "内部超时错误，请稍后再试或联系客服。 | An internal timeout error has occurred during execution, please try again later or contact service support.",
    RewriteFailed:
      "调用改写prompt的大模型失败。 | Failed to rewrite content for prompt.",
    RetrivalFailed: "文档检索失败。 | Failed to retrieve data from documents.",
    AppProcessFailed:
      "应用流程处理失败。 | Failed to proceed application request.",
    ModelServiceFailed: "模型服务调用失败。 | Failed to request model service.",
    InvokePluginFailed: "插件调用失败。 | Failed to invoke plugin.",
    ModelUnavailable:
      "模型暂时无法提供服务，请稍后再试。 | Model is unavailable, please try again later.",
  };
  router.post("/tyqw", async function (req: any, res) {
    const api = new TongYiAPI({
      apiKey: process.env.TY_API_KEY,
      model: process.env.TY_MODEL || "qwen-plus",
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
      const json = await api.sendMessage(message, {
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

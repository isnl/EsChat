import express from "express";
import { tyqw, gpt3 } from "./chat/index";
import { onUserCheck } from "src/utils";

const router = express.Router();
onUserCheck(router);

tyqw(router);
gpt3(router);

router.post("/", async function (req: any, res) {
  res.redirect(307, process.env.TY_API_KEY ? "/chat/tyqw" : "/chat/gpt3");
});

export default router;

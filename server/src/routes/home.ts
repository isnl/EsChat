import express from "express";
import { onUserCheck } from "src/utils";
const router = express.Router();
onUserCheck(router);
router.get("/status", async function (req, res) {
  res.json({
    code: 200,
  });
});
export default router;

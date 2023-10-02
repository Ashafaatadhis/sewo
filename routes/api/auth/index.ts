import express from "express";
import google from "./google";
import github from "./github";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "woi" });
});

router.use("/google", google);
router.use("/github", github);

export default router;

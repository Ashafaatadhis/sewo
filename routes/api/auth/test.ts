import express from "express";
import passport from "../../../middleware/auth";

const router = express.Router();

router.get("/", (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  res.json({ msg: "ok" });
});

export default router;

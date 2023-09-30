import express from "express";
import HttpError from "../../utils/errors/HttpError";
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ msg: "tfeds" });
});

export default router;

import express from "express";
import google from "./google";
import github from "./github";
import jwt from "./jwt";
import test from "./test";

const router = express.Router();

router.use("/", jwt);
router.use("/google", google);
router.use("/github", github);
router.use("/test", test);

export default router;

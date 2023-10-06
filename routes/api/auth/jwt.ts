import express from "express";
import passport from "../../../middleware/auth";

const router = express.Router();

router.get("/signin");
router.get("/signup");
router.get("/refresh");

export default router;

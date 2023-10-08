import express from "express";
import {
  jwtRefresh,
  jwtSignup,
} from "../../../controllers/auth/jwt.controller";

const router = express.Router();

router.get("/signin");
router.post("/signup", jwtSignup);
router.get("/refresh", jwtRefresh);

export default router;

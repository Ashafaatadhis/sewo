import express from "express";
import {
  jwtRefresh,
  jwtSignin,
  jwtSignup,
} from "../../../controllers/auth/jwt.controller";
import validate from "../../../middleware/validation";
import registerSchema from "../../../helper/schema/registerSchema";
import loginSchema from "../../../helper/schema/loginSchema";

const router = express.Router();

router.post("/signin", validate(loginSchema), jwtSignin);
router.post("/signup", validate(registerSchema), jwtSignup);
router.get("/refresh", jwtRefresh);

export default router;

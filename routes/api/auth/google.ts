import express from "express";
import passport from "../../../middleware/auth";
import {
  googleCb,
  googleFailure,
} from "../../../controllers/auth/google.controller";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
    session: false,
  }),
  googleCb
);

router.get("/failure", googleFailure);

export default router;

import express from "express";
import passport from "../../../middleware/auth";
import {
  githubCb,
  githubFailure,
} from "../../../controllers/auth/github.controller";
const router = express.Router();

router.get("/", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/callback",
  passport.authenticate("github", {
    failureRedirect: "/api/auth/google/failure",
    session: false,
  }),
  githubCb
);

router.get("/failure", githubFailure);

export default router;

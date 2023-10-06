import express from "express";
import auth from "./auth";
import passport from "../../middleware/auth";
import { user } from "./(protected)";

const router = express.Router();

router.get("/", (req, res) => {
  res.send({ msg: "tfeds" });
});

router.use("/auth", auth);
router.use("/user", passport.authenticate("jwt", { session: false }), user);

export default router;

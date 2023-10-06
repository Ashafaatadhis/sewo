import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.user);
  res.json({ msg: "this is protected route" });
});

export default router;

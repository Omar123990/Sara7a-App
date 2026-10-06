import { Router } from "express";
import { signIn, signUp, refreshToken } from "./auth.service.js";

const router = Router();

router.post("/signup", async (req, res) => {
  const user = await signUp(req.body);
  res.status(201).json({ status: "success", user });
});
router.post("/signin", async (req, res) => {
  const user = await signIn(req.body);
  res.status(200).json({ status: "success", user });
});
router.post("/refreshToken", async (req, res) => {
  const data = await refreshToken(req.body);
  res.status(200).json({ status: "success", data });
});

export default router;

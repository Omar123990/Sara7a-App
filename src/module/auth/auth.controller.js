import { Router } from "express";
import { signIn, signIn, signUp } from "./auth.service.js";

const router = Router();

router.post("/signup", async (req, res) => {
  const data = await signUp(req.body);
  res.json(data);
});
router.post("/signin", async (req, res) => {
  const data = await signIn(req.body);
  res.json(data);
});

export default router;

import { Router } from "express";
import {  signIn, signUp } from "./auth.service.js";

const router = Router();

router.post("/signup", async (req, res) => {
  const user = await signUp(req.body);
  res.status(201).json({ status: "success", user });
});
router.post("/signin", async (req, res) => {
  const user = await signIn(req.body);
  res.status(200).json({ status: "success", user });
});


export default router;

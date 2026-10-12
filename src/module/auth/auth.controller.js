import { Router } from "express";
import { signIn, signUp, refreshToken, verifyEmail } from "./auth.service.js";
import { signInSchema, signUpSchema } from "./auth.validation.js";
import { validation } from "../../common/services/validation.service.js";

const router = Router();

router.post("/signup", validation(signUpSchema), async (req, res) => {
  const user = await signUp(req.body);
  res.json({ status: "success", user });
});
router.post("/signin", validation(signInSchema), async (req, res) => {
  const user = await signIn(req.body);
  res.json({ status: "success", user });
});
router.post("/refreshToken", (req, res) => {
  const data = refreshToken(req.body);
  res.json({ status: "success", data });
});
router.post("/verifyEmail", async (req, res) => {
  const data = await verifyEmail(req.body);
  res.json({ status: "success", data });
});
export default router;

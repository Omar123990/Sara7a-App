import { Router } from "express";
import { getUsetById, signIn, signIn, signUp } from "./auth.service.js";
import { auth } from "../../common/services/token.srevice.js";

const router = Router();

router.post("/signup", async (req, res, next) => {
  try {
    const user = await signUp(req.body);
    res.status(201).json({ status: "success", user });
  } catch (error) {
    next(error);
  }
});
router.post("/signin", async (req, res) => {
 try {
  const user = await signIn(req.body);
  res.status(200).json({ status: "success", user });
 } catch (error) {
  next(error);
 }
});

router.get("/get-user-by-id", auth , async (req, res,next) => {
  try {
    const user = await getUsetById(req.user.id);
    res.status(200).json({ status: "success", user });
  } catch (error) {
    next()
  }
})
export default router;

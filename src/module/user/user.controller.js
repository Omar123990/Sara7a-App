import { Router } from 'express';
import { getUserById, searchUser } from './user.service.js';
import { auth } from "../../common/services/token.srevice.js";


const router = Router();

router.get("/get-user-by-id", auth, async (req, res) => {
  const user = await getUserById(req.user.id);
  res.status(200).json({ status: "success", user });
});
router.get("/search-user", async (req, res) => {
  const user = await searchUser(req.query);
  res.status(200).json({ status: "success", user });
});

export default router;
import { Router } from "express";
import { getAllUsers, getUserById, searchUser, uploadProfileImage } from "./user.service.js";
import { auth } from "../../common/services/token.service.js";
import { checkRoles } from "../../common/services/checkRoles.js";
import { upload } from "../../common/meddelWares/multer.js";

const router = Router();

router.get("/get-user-by-id", auth, async (req, res) => {
  const user = await getUserById(req.user.id);
  res.status(200).json({ status: "success", user });
});
router.get("/search-user", async (req, res) => {
  const user = await searchUser(req.query);
  res.status(200).json({ status: "success", user });
});
router.get("/get-all-users", auth, checkRoles(["1"]), async (req, res) => {
  const data = await getAllUsers();
  res.json({ status: "success", data });
});
router.post(
  "/upload-profile-image",
  upload.single("image"),
  auth,
  async (req, res) => {
    const data = await uploadProfileImage(req.user.id, req.file);
    res.json({ status: "success", data });
  },
);
export default router;

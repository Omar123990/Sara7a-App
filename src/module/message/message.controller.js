import { Router } from "express";
import { auth } from "../../common/services/token.service.js";
import {
  getAllMessages,
  getUrl,
  getUserData,
  getUserMessages,
  sendMessage,
} from "./message.service.js";
import { messageSchema } from "./message.validation.js";
import { checkRoles } from "../../common/services/checkRoles.js";
import validation from "../../common/services/validation.service.js";
import { upload } from "../../common/meddelWares/multer.js";
const router = Router();
router.get("/get-all-messages", auth, checkRoles(["1"]), async (req, res) => {
  let data = await getAllMessages();
  res.json(data);
});
//validation(messageSchema)
router.post("/send-message", upload().single("image"), async (req, res) => {
  let data = await sendMessage(req.body, req.file);
  res.status(201).json({ message: "message sent successfully", data });
});
router.get("/user-url", auth, async (req, res) => {
  let url = await getUrl(req.user);
  res.json(url);
});
router.get("/user-data", async (req, res) => {
  let data = await getUserData(req.body);
  res.json(data);
});
router.get("/get-user-messages", auth, async (req, res) => {
  let data = await getUserMessages(req.user);
  res.json(data);
});

// router.put("/update-user", auth, upload().single("image"), async (req, res) => {
//   let data = updateUser(req.body, req.file, req.user);
//   res.json(data);
// });
export default router;

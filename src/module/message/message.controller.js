import { Router } from "express";
import { auth } from "../../common/services/token.service.js";
import {
  deleteUserMessage,
  getAllMessages,
  getUrl,
  getUserData,
  getUserMessages,
  sendMessage,
} from "./message.service.js";
import {
  messageIdParamsSchema,
  messageSchema,
  userUrlQuerySchema,
} from "./message.validation.js";
import { checkRoles } from "../../common/services/checkRoles.js";
import { validation } from "../../common/services/validation.service.js";
import { upload } from "../../common/meddelWares/multer.js";

const router = Router();

// Lists all messages for an authenticated administrator.
router.get("/get-all-messages", auth, checkRoles(["1"]), async (req, res) => {
  const data = await getAllMessages();
  res.json(data);
});

// Creates an anonymous message for a recipient, with an optional image.
router.post(
  "/send-message",
  validation(messageSchema),
  upload.single("image"),
  async (req, res) => {
    const data = await sendMessage(req.body, req.file);
    res.status(201).json({ message: "message sent successfully", data });
  },
);

// Returns the authenticated user's anonymous-message URL.
router.get("/user-url", auth, async (req, res) => {
  const url = await getUrl(req.user);
  res.json(url);
});

// Resolves a public account URL to displayable profile data.
router.get(
  "/user-data",
  validation(userUrlQuerySchema, "query"),
  async (req, res) => {
    const data = await getUserData(req.query);
    res.json(data);
  },
);

// Lists messages received by the authenticated user.
router.get("/get-user-messages", auth, async (req, res) => {
  const data = await getUserMessages(req.user);
  res.json(data);
});

// Deletes one message owned by the authenticated recipient.
router.delete(
  "/:messageId",
  auth,
  validation(messageIdParamsSchema, "params"),
  async (req, res) => {
    const data = await deleteUserMessage(req.params.messageId, req.user);
    res.json({ status: "success", data });
  },
);

export default router;

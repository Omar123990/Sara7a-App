import { Router } from "express";
import {
  changePassword,
  deleteUser,
  getAllUsers,
  getPublicProfile,
  getUserById,
  requestEmailChange,
  searchUser,
  updateUser,
  uploadProfileImage,
  verifyEmailChange,
} from "./user.service.js";
import { auth } from "../../common/services/token.service.js";
import { checkRoles } from "../../common/services/checkRoles.js";
import { upload } from "../../common/meddelWares/multer.js";
import { validation } from "../../common/services/validation.service.js";
import {
  changeEmailSchema,
  changePasswordSchema,
  uniqueNameParamsSchema,
  verifyEmailChangeSchema,
} from "./user.validation.js";

const router = Router();

// Returns the authenticated user's full account data.
router.get("/get-user-by-id", auth, async (req, res) => {
  const user = await getUserById(req.user.id);
  res.status(200).json({ status: "success", user });
});

// Returns a public profile using its unique name.
router.get(
  "/profile/:uniqueName",
  validation(uniqueNameParamsSchema, "params"),
  async (req, res) => {
    const user = await getPublicProfile(req.params.uniqueName);
    res.status(200).json({ status: "success", user });
  },
);

// Searches accounts by name.
router.get("/search-user", async (req, res) => {
  const user = await searchUser(req.query);
  res.status(200).json({ status: "success", user });
});

// Lists all accounts for an authenticated administrator.
router.get("/get-all-users", auth, checkRoles(["1"]), async (req, res) => {
  const data = await getAllUsers();
  res.json({ status: "success", data });
});

// Uploads and saves a profile image for the authenticated user.
router.post(
  "/upload-profile-image",
  upload.single("image"),
  auth,
  async (req, res) => {
    const data = await uploadProfileImage(req.user.id, req.file);
    res.json({ status: "success", data });
  },
);

// Updates editable account fields and an optional profile image.
router.put("/update-user", auth, upload.single("image"), async (req, res) => {
  const data = await updateUser(req.body, req.file, req.user);
  res.json({ status: "success", data });
});

// Changes the authenticated user's password after checking the current one.
router.patch(
  "/change-password",
  auth,
  validation(changePasswordSchema),
  async (req, res) => {
    const data = await changePassword(req.body, req.user);
    res.json({ status: "success", data });
  },
);

// Sends a verification OTP to a new email after checking the current password.
router.post(
  "/change-email",
  auth,
  validation(changeEmailSchema),
  async (req, res) => {
    const data = await requestEmailChange(req.body, req.user);
    res.json({ status: "success", data });
  },
);

// Verifies the new email OTP and updates the authenticated account.
router.post(
  "/verify-email-change",
  auth,
  validation(verifyEmailChangeSchema),
  async (req, res) => {
    const data = await verifyEmailChange(req.body, req.user);
    res.json({ status: "success", data });
  },
);

// Deletes the authenticated user's account.
router.delete("/delete-user", auth, async (req, res) => {
  await deleteUser(req.user);
  res.json({ status: "success", message: "user deleted successfully" });
});

export default router;

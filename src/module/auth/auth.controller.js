import { Router } from "express";
import {
  forgotPassword,
  refreshToken,
  resendVerificationOtp,
  resetPassword,
  signIn,
  signUp,
  verifyEmail,
} from "./auth.service.js";
import {
  emailSchema,
  refreshTokenSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  verifyEmailSchema,
} from "./auth.validation.js";
import { validation } from "../../common/services/validation.service.js";

const router = Router();

// Registers an account and sends its email-verification OTP.
router.post("/signup", validation(signUpSchema), async (req, res) => {
  const user = await signUp(req.body);
  res.json({ status: "success", user });
});

// Authenticates a verified account and returns its JWTs.
router.post("/signin", validation(signInSchema), async (req, res) => {
  const user = await signIn(req.body);
  res.json({ status: "success", user });
});

// Exchanges a valid refresh token for a new access token.
router.post(
  "/refreshToken",
  validation(refreshTokenSchema),
  async (req, res) => {
    const data = refreshToken(req.body);
    res.json({ status: "success", data });
  },
);

// Confirms an account's email address using its OTP.
router.post(
  "/verifyEmail",
  validation(verifyEmailSchema),
  async (req, res) => {
    const data = await verifyEmail(req.body);
    res.json({ status: "success", data });
  },
);

// Resends the email-verification OTP to an unverified account.
router.post(
  "/resend-otp",
  validation(emailSchema),
  async (req, res) => {
    const data = await resendVerificationOtp(req.body);
    res.json({ status: "success", data });
  },
);

// Sends a password-reset OTP to a verified account.
router.post(
  "/forgot-password",
  validation(emailSchema),
  async (req, res) => {
    const data = await forgotPassword(req.body);
    res.json({ status: "success", data });
  },
);

// Resets the password after validating the recovery OTP.
router.post(
  "/reset-password",
  validation(resetPasswordSchema),
  async (req, res) => {
    const data = await resetPassword(req.body);
    res.json({ status: "success", data });
  },
);

export default router;

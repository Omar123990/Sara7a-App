import z from "zod";

export const uniqueNameParamsSchema = z.strictObject({
  uniqueName: z.string().min(3).max(32),
});

export const changePasswordSchema = z
  .strictObject({
    currentPassword: z.string().min(8).max(32),
    newPassword: z.string().min(8).max(32),
    rePassword: z.string().min(8).max(32),
  })
  .refine((data) => data.newPassword === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export const changeEmailSchema = z.strictObject({
  email: z.string().email(),
  password: z.string().min(8).max(32),
});

export const verifyEmailChangeSchema = z.strictObject({
  otp: z.string().regex(/^\d{6}$/),
});

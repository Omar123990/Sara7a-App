import z from "zod";

export const signInSchema = z.strictObject({
  email: z.string().email(),
  password: z.string().min(8).max(32),
});
export const signUpSchema = z.strictObject({
  name: z.string().min(3).max(32),
  uniqueName: z.string().min(3).max(32),
  email: z.string().email(),
  password: z.string().min(8).max(32),
  rePassword: z.string().min(8).max(32),
  age: z.coerce.number().min(18).max(100),
  gender: z.string(),
  phone: z.string().min(8).max(32),
});

export const emailSchema = z.strictObject({
  email: z.string().email(),
});

export const refreshTokenSchema = z.strictObject({
  refreshToken: z.string().min(1),
});

export const verifyEmailSchema = z.strictObject({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/),
});

export const resetPasswordSchema = z
  .strictObject({
    email: z.string().email(),
    otp: z.string().regex(/^\d{6}$/),
    password: z.string().min(8).max(32),
    rePassword: z.string().min(8).max(32),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

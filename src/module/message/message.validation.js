import z from "zod";

export const messageSchema = z.strictObject({
  content: z.string().min(3),
  resiverId: z.string().regex(/^[\da-f]{24}$/i),
});

export const messageIdParamsSchema = z.strictObject({
  messageId: z.string().regex(/^[\da-f]{24}$/i),
});

export const userUrlQuerySchema = z.strictObject({
  url: z.string().url(),
});

import z from "zod";

export const messageSchema = z.strictObject({
  content: z.string().minLength(3),
});

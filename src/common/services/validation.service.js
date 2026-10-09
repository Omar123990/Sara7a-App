import { BadRequestException } from "../errors/appError.js";

export const validation = (schema) => {
  return (req, res, next) => {
    const { error, success } = schema.safeParse(req.body);
    if (!success) {
      return BadRequestException({
        message: error.message,
        extra: error.issues,
      });
    }
    next();
  };
};

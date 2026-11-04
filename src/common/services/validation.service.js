import { BadRequestException } from "../errors/appError.js";

export const validation = (schema, source = "body") => {
  return (req, res, next) => {
    const { error, success } = schema.safeParse(req[source]);
    if (!success) {
      return BadRequestException({
        message: error.message,
        extra: error.issues,
      });
    }
    next();
  };
};

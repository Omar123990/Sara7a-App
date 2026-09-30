import { env } from "../../config/env.service.js";

export const ErrorResponse = ({
  status = 400,
  message = "Something went wrong",
  extra = undefined,
} = {}) => {
  throw new Error(message, { cause: { status, extra } });
};

export const BadRequestException = ({
  message = "Bad request",
  extra = undefined,
} = {}) => {
  return ErrorResponse({ status: 400, message: message, extra: extra });
};

export const NotFoundException = ({
  message = "Not found error",
  extra = undefined,
} = {}) => {
  return ErrorResponse({ status: 404, message: message, extra: extra });
};

export const ConflictException = ({
  message = "conflict error",
  extra = undefined,
} = {}) => {
  return ErrorResponse({ status: 409, message: message, extra: extra });
};

export const UnauthorizedException = ({
  message = "UnAuthorized error",
  extra = undefined,
} = {}) => {
  return ErrorResponse({ status: 401, message: message, extra: extra });
};

export const ForbiddenException = ({
  message = "Forbidden error",
  extra = undefined,
} = {}) => {
  return ErrorResponse({ status: 403, message: message, extra: extra });
};

export const golbalHandlingError = (err, req, res, next) => {
  const mood = env.mood == "dev";
  const status = err.status ? err.status : err.cause ? err.cause.status : 500;
  const deafultMessage = "something went wrong";
  const displayErrorMessage = err.message || deafultMessage;

  res.status(status).json({
    stack: mood ? err.stack : null,
    message: mood ? displayErrorMessage : deafultMessage,
    extra: mood ? err.cause : null,
  });
};

import jwt from "jsonwebtoken";
import { env } from "../../config/env.service.js";
import { BadRequestException } from "../errors/appError.js";

export const auth = (req, res, next) => {
  let [flag, token] = req.headers.authorization.split(" ");
  switch (flag) {
    case "Basic":
      const basicData = Buffer.from(token, "base64").toString();
      let [email, password] = basicData.split(":");
      req.user = { email, password };
      break;
    case "Bearer":
      let decodedData = jwt.decode(token);
      let signature;
      switch (decodedData.aud) {
        case env.adminAud:
          signature = env.adminTokenKey;
          break;
        case env.userAud:
          signature = env.userTokenKey;
          break;
      }
      const decoded = jwt.verify(token, signature);
      if (decoded) {
        req.user = decoded;
        next();
      } else {
        return BadRequestException({ message: "Invalid token" });
      }
      break;
  }
};

export const generateToken = (user) => {
  const role = String(user.role);

  switch (role) {
    case "1": {
      let token = jwt.sign({ id: user._id }, env.adminTokenKey, {
        expiresIn: "30m",
        audience: env.adminAud,
      });
      let refreshToken = jwt.sign({ id: user._id }, env.adminRefreshTokenKey, {
        expiresIn: "1y",
        audience: env.adminAud,
      });
      return { token, refreshToken };
    }

    case "0": {
      let userToken = jwt.sign({ id: user._id }, env.userTokenKey, {
        expiresIn: "30m",
        audience: env.userAud,
      });
      let userRefreshToken = jwt.sign(
        { id: user._id },
        env.userRefreshTokenKey,
        {
          expiresIn: "1y",
          audience: env.userAud,
        },
      );
      return { token: userToken, refreshToken: userRefreshToken };
    }

    default:
      throw new Error(`Invalid or missing user role: ${user.role}`);
  }
};

export const generateAccessToken = (token) => {
  let decodedData = jwt.decode(token);
  if (!decodedData || !decodedData.aud) {
    throw BadRequestException({ message: "Invalid token structure" });
  }

  let refreshSignature;
  let accessSignature;

  switch (decodedData.aud) {
    case env.adminAud:
      refreshSignature = env.adminRefreshTokenKey;
      accessSignature = env.adminTokenKey;
      break;
    case env.userAud:
      refreshSignature = env.userRefreshTokenKey;
      accessSignature = env.userTokenKey;
      break;
    default:
      throw BadRequestException({ message: "Invalid token audience" });
  }
  let decoded = jwt.verify(token, refreshSignature);

  let newToken = jwt.sign({ id: decoded.id }, accessSignature, {
    expiresIn: "30m",
    audience: decodedData.aud,
  });

  return newToken;
};

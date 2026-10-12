import { userModel } from "../../database/model/user.model.js";
import { UnauthorizedException } from "../errors/appError.js";

export const checkRoles = (roles) => {
  return async (req, res, next) => {
    let userData = await userModel.findById(req.user.id);
    if (userData.role.includes(roles)) {
      next();
    } else {
      return UnauthorizedException({ message: "You are not authorized" });
    }
  };
};

// checkRoles by aud

// export const checkRoles2 = (roles) => {
//   return async (req, res, next) => {
//     if (roles.includes(req.user.aud)) {
//       next();
//     } else {
//       return UnauthorizedException({ message: "You are not authorized" });
//     }
//   };
// };

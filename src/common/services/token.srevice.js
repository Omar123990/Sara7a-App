import jwt from 'jsonwebtoken';
import { env } from '../../config/env.service.js';


export const auth = (req, res, next) => {
  let decodedData = jwt.verify(req.headers.token, env.token_key);
  req.user = decodedData;
  next();
};
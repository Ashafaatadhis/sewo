import jwt from "jsonwebtoken";
import config from "../../config/config";

export const accessTokenSign = (id: number) => {
  return jwt.sign({ id }, config.jwt.secret, { expiresIn: "30s" });
};

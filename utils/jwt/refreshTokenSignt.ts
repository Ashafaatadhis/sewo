import jwt from "jsonwebtoken";
import config from "../../config/config";

export const refreshTokenSign = (id: number) => {
  return jwt.sign({ id }, config.jwt.secret, { expiresIn: "24h" });
};

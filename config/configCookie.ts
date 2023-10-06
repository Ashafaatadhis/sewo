import { CookieOptions } from "express";
import config from "./config";

const optionRefresh: CookieOptions =
  config.env == "production"
    ? {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      }
    : {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      };

const optionClearRefresh: CookieOptions =
  config.env == "production"
    ? {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      }
    : {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      };

export const refreshTokenConfig: CookieOptions = optionRefresh;
export const clearRefreshTokenConfig: CookieOptions = optionClearRefresh;

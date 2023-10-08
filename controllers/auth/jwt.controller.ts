import { NextFunction, Request, Response } from "express";

import { StatusCodes, ReasonPhrases } from "http-status-codes";
import config from "../../config/config";
import HttpError from "../../utils/errors/HttpError";
import {
  clearRefreshTokenConfig,
  refreshTokenConfig,
} from "../../config/configCookie";
import { accessTokenSign, refreshTokenSign } from "../../utils/jwt";
import prisma from "../../config/configPrisma";
import bodyUser from "../../types/bodyUserType";

const jwtRefresh = async (req: Request, res: Response, next: NextFunction) => {
  const token: string | undefined =
    req.cookies[config.cookie.refreshToken.name];

  if (!token) {
    return next(
      new HttpError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
    );
  }

  console.log(token);
  const getOldToken = await prisma.account_token.findFirst({
    where: {
      token: token,
    },
    include: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });
  console.log("old token ", getOldToken);
  // cari usernya
  if (!getOldToken) {
    return next(
      new HttpError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
    );
  }
  const accessToken = accessTokenSign(getOldToken?.userId);
  const refreshToken = refreshTokenSign(getOldToken?.userId);
  await prisma.account_token.update({
    where: {
      token: getOldToken?.token,
    },

    data: {
      token: refreshToken,
    },
  });
  res.clearCookie(config.cookie.refreshToken.name, clearRefreshTokenConfig);
  res.cookie(config.cookie.refreshToken.name, refreshToken, refreshTokenConfig);
  return res.json({ success: true, payload: { accessToken }, msg: null });
};

const signup = (req: Request, res: Response) => {
  const body: bodyUser = req.body;
  console.log(body);
};

export { signup as jwtSignup, jwtRefresh };

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
  // disini tokennya sama dengan pemanggilan ke 1
  if (!token) {
    return next(
      new HttpError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
    );
  }
  console.log("ini token ", token);
  res.clearCookie(config.cookie.refreshToken.name, clearRefreshTokenConfig);

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

  //   jadi ketika mencari berdasarkan token, maka akan null
  console.log("old token ", getOldToken);
  console.log("coyy : ", getOldToken?.id);
  // cari usernya
  if (!getOldToken) {
    return next(
      new HttpError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
    );
  }

  const accessToken = accessTokenSign(getOldToken?.userId);
  const refreshToken = refreshTokenSign(getOldToken?.userId);
  console.log(refreshToken + "  woei weoi fjwoiefj");
  try {
    await prisma.account_token.create({
      data: {
        token: refreshToken,
        token_type: "Bearer",
        userId: getOldToken.userId,
      },
    });
  } catch (e) {
    console.log("error");
  }

  //   karena token yang ke 1 sudah diganti dengan yang baru
  console.log("trmksh");
  res.cookie(config.cookie.refreshToken.name, refreshToken, refreshTokenConfig);
  console.log("trmksh2");
  return res.json({ success: true, payload: { accessToken }, msg: null });
};

const signup = (req: Request, res: Response) => {
  const body: bodyUser = req.body;
  console.log(body);
};

export { signup as jwtSignup, jwtRefresh };

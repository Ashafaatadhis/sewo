import { NextFunction, Request, Response } from "express";
import { compare } from "bcrypt";
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
import findUsersEmail from "../../helper/create/findUsersEmail";
import bcrypt from "../../utils/bcrypt";
import findUserByUsername from "../../helper/create/findUserByUsername";

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

  // cari usernya
  if (!getOldToken) {
    return next(
      new HttpError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
    );
  }

  const accessToken = accessTokenSign(getOldToken?.userId);
  const refreshToken = refreshTokenSign(getOldToken?.userId);

  try {
    await prisma.account_token.create({
      data: {
        token: refreshToken,
        token_type: "Bearer",
        userId: getOldToken.userId,
      },
    });
  } catch (e: any) {
    return next(e);
  }

  //   karena token yang ke 1 sudah diganti dengan yang baru

  res.cookie(config.cookie.refreshToken.name, refreshToken, refreshTokenConfig);

  return res.json({ success: true, payload: { accessToken }, msg: null });
};

const signin = async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  const user: bodyUser = req.body;
  const isExist = await findUserByUsername(user.username);

  if (!isExist) {
    return next(new Error("Username or password wrong"));
  }

  const isSame = await compare(user.password, isExist.password);
  if (!isSame) {
    return next(new Error("Username or password wrong"));
  }

  await prisma.account_token.deleteMany({
    where: {
      userId: isExist.id,
    },
  });

  const refreshToken = refreshTokenSign(isExist.id);
  const accessToken = accessTokenSign(isExist.id);

  await prisma.account_token.create({
    data: {
      token: refreshToken,
      userId: isExist.id,
      token_type: "Bearer",
    },
  });
  if (cookies[config.cookie.refreshToken.name]) {
    res.clearCookie(config.cookie.refreshToken.name, clearRefreshTokenConfig);
  }
  res.cookie(config.cookie.refreshToken.name, refreshToken, refreshTokenConfig);

  return res.json({
    success: true,
    payload: { accessToken },
    msg: null,
  });
};

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const user: bodyUser = req.body;
  if (user.password !== user.confirmPassword) {
    return res.json({
      success: false,
      payload: null,
      msg: "Confirmation password not same",
    });
  }
  const isExist = await findUsersEmail({
    email: user.email,
    provider: "credentials",
  });

  if (isExist) {
    return next(new Error("User is exist"));
  }

  const email = await prisma.users_email.create({
    data: {
      email: user.email,
      emailVerified: false,
      provider: "credentials",
    },
  });
  await prisma.user.create({
    data: {
      username: user.username,
      image: "none",
      password: await bcrypt(user.password),
      roleId: 2,
      emailId: email.id,
    },
  });

  return res.json({
    success: true,
    payload: null,
    msg: "User is created",
  });
};

export { signup as jwtSignup, jwtRefresh, signin as jwtSignin };

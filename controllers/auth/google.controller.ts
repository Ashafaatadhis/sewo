import { NextFunction, Request, Response } from "express";
import findUsersEmail from "../../helper/create/findUsersEmail";
import HttpError from "../../utils/errors/HttpError";
import { refreshTokenSign } from "../../utils/jwt";
import bcrypt from "../../utils/bcrypt";
import {
  clearRefreshTokenConfig,
  refreshTokenConfig,
} from "../../config/configCookie";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import config from "../../config/config";
import generateRandomString from "../../utils/generateRandomValues";
import prisma from "../../config/configPrisma";

const callback = async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;

  if (!req.user) {
    return next(
      new HttpError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
    );
  }
  const userType: any = req.user;
  const user = {
    displayName: userType.displayName,
    name: userType.name.givenName,
    image: userType.photos[0].value,
    email: userType._json.email,
    emailVerified: userType.email_verified,
    provider: userType.provider,
  };

  const isExist = await findUsersEmail(user);

  try {
    if (!isExist?.user) {
      const email = await prisma.users_email.create({
        data: {
          email: user.email,
          emailVerified: user.emailVerified,
          provider: user.provider,
        },
      });
      const userAccount = await prisma.user.create({
        data: {
          username: user.displayName,
          image: user.image,
          password: await bcrypt(generateRandomString()),
          roleId: 2,
          emailId: email.id,
        },
      });

      // const accessToken = accessTokenSign(userAccount.id);
      const refreshToken = refreshTokenSign(userAccount.id);

      await prisma.account_token.deleteMany({
        where: {
          userId: userAccount.id,
        },
      });
      await prisma.account_token.create({
        data: {
          token: refreshToken,
          userId: userAccount.id,
          token_type: "Bearer",
        },
      });

      if (cookies[config.cookie.refreshToken.name]) {
        res.clearCookie(
          config.cookie.refreshToken.name,
          clearRefreshTokenConfig
        );
      }
      res.cookie(
        config.cookie.refreshToken.name,
        refreshToken,
        refreshTokenConfig
      );

      return res.redirect(config.redirect);

      // return res.json({
      //   success: true,
      //   payload: { accessToken },
      //   msg: null,
      // });
    }

    //   =======================
    //   end of elsea

    await prisma.account_token.deleteMany({
      where: {
        userId: isExist.id,
      },
    });

    const refreshToken = refreshTokenSign(isExist.user.id);
    await prisma.account_token.create({
      data: {
        token: refreshToken,
        userId: isExist.user.id,
        token_type: "Bearer",
      },
    });

    if (cookies[config.cookie.refreshToken.name]) {
      res.clearCookie(config.cookie.refreshToken.name, clearRefreshTokenConfig);
    }
    res.cookie(
      config.cookie.refreshToken.name,
      refreshToken,
      refreshTokenConfig
    );

    return res.redirect(config.redirect);
    // return res.json({
    //   success: true,
    //   payload: { accessToken },
    //   msg: null,
    // });
  } catch (e: any) {
    throw new HttpError(500, e.message);
  }
};

const failure = (req: Request, res: Response) => {
  res.json({ success: false, payload: null, msg: "failure" });
};

export { callback as googleCb, failure as googleFailure };

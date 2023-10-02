import express from "express";
import passport from "../../../middleware/auth";
import { Request, Response } from "express";
import findUsersEmail from "../../../helper/create/findUsersEmail";
import HttpError from "../../../utils/errors/HttpError";
import { accessTokenSign, refreshTokenSign } from "../../../utils/jwt";
import prisma from "../../../config/configPrisma";
const router = express.Router();

router.get("/", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/callback",
  passport.authenticate("github", {
    failureRedirect: "/api/auth/google/failure",
    session: false,
  }),
  async (req: Request, res: Response) => {
    const userType: any = req.user;

    const user = {
      displayName: userType.displayName,
      name: userType.username,
      image: userType.photos[0].value,
      email: userType._json.email,
      emailVerified: userType.email_verified,
      provider: userType.provider,
    };

    user.emailVerified = true;

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
            name: user.displayName,
            roleId: 2,
            emailId: email.id,
          },
        });

        const accessToken = accessTokenSign(userAccount.id);
        const refreshToken = refreshTokenSign(userAccount.id);
        const accountToken = await prisma.account_token.create({
          data: {
            token: refreshToken,
            userId: userAccount.id,
            token_type: "Bearer",
          },
        });

        await prisma.account.create({
          data: {
            username: user.name,
            provider: user.provider,
            userId: userAccount.id,
            tokenId: accountToken.id,
          },
        });

        return res.json({
          success: true,
          payload: { accessToken, refreshToken },
          msg: null,
        });
      }

      //   =======================
      //   end of else

      const getOldToken = await prisma.account_token.findFirst({
        where: {
          user: {
            email: {
              AND: {
                email: user.email,
                provider: user.provider,
              },
            },
          },
        },
      });

      const accessToken = accessTokenSign(isExist.user.id);
      const refreshToken = refreshTokenSign(isExist.user.id);
      const accountToken = await prisma.account_token.upsert({
        where: {
          token: getOldToken?.token,
        },

        update: {
          token: refreshToken,
        },

        create: {
          token: refreshToken,
          token_type: "Bearer",
          userId: isExist.user.id,
        },
      });

      prisma.account.upsert({
        where: {
          tokenId: accountToken.id,
        },
        update: {
          tokenId: accountToken.id,
        },

        create: {
          username: user.name,
          provider: user.provider,
          userId: isExist.user.id,
          tokenId: accountToken.id,
        },
      });

      return res.json({
        success: true,
        payload: { accessToken, refreshToken },
        msg: null,
      });
    } catch (e: any) {
      throw new HttpError(500, e.message);
    }
  }
);

router.get("/failure", (req: Request, res: Response) => {
  res.json({ msg: "failed" });
});

export default router;

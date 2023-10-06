import prisma from "../config/configPrisma";

import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth2";
import passport from "passport";
import config from "../config/config";
import { Request } from "express";

import {
  ExtractJwt,
  Strategy as JwtStrategy,
  VerifiedCallback,
} from "passport-jwt";

import { Strategy as GitHubStrategy } from "passport-github2";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.secret,
    },
    async (jwt_payload: any, done: VerifiedCallback) => {
      try {
        const user = await prisma.user.findFirst({
          where: {
            id: jwt_payload.id,
          },
        });

        if (!user) return done(null, false);

        return done(null, user);
      } catch (e: any) {
        throw new Error(e.message);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: config.auth.google.google_client_id,
      clientSecret: config.auth.google.google_client_secret,
      callbackURL: "http://localhost:8080/api/auth/google/callback",
      passReqToCallback: true,
    },
    function (
      request: Request,
      access_token: String,
      refreshToken: String,
      profile: any,
      done: VerifyCallback
    ) {
      return done(null, profile);
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: config.auth.github.github_client_id,
      clientSecret: config.auth.github.github_client_secret,
      callbackURL: "http://localhost:8080/api/auth/github/callback",
    },
    function (
      access_token: String,
      refreshToken: String,
      profile: any,
      done: VerifyCallback
    ) {
      return done(null, profile);
    }
  )
);

export default passport;

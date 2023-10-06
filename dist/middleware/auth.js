"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configPrisma_1 = __importDefault(require("../config/configPrisma"));
const passport_google_oauth2_1 = require("passport-google-oauth2");
const passport_1 = __importDefault(require("passport"));
const config_1 = __importDefault(require("../config/config"));
const passport_jwt_1 = require("passport-jwt");
const passport_github2_1 = require("passport-github2");
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config_1.default.jwt.secret,
}, (jwt_payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield configPrisma_1.default.user.findFirst({
            where: {
                id: jwt_payload.id,
            },
        });
        if (!user)
            return done(null, false);
        return done(null, user);
    }
    catch (e) {
        throw new Error(e.message);
    }
})));
passport_1.default.use(new passport_google_oauth2_1.Strategy({
    clientID: config_1.default.auth.google.google_client_id,
    clientSecret: config_1.default.auth.google.google_client_secret,
    callbackURL: "http://localhost:8080/api/auth/google/callback",
    passReqToCallback: true,
}, function (request, access_token, refreshToken, profile, done) {
    return done(null, profile);
}));
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: config_1.default.auth.github.github_client_id,
    clientSecret: config_1.default.auth.github.github_client_secret,
    callbackURL: "http://localhost:8080/api/auth/github/callback",
}, function (access_token, refreshToken, profile, done) {
    return done(null, profile);
}));
exports.default = passport_1.default;

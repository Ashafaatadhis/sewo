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
exports.githubFailure = exports.githubCb = void 0;
const findUsersEmail_1 = __importDefault(require("../../helper/create/findUsersEmail"));
const HttpError_1 = __importDefault(require("../../utils/errors/HttpError"));
const jwt_1 = require("../../utils/jwt");
const bcrypt_1 = __importDefault(require("../../utils/bcrypt"));
const config_1 = __importDefault(require("../../config/config"));
const configCookie_1 = require("../../config/configCookie");
const http_status_codes_1 = require("http-status-codes");
const configPrisma_1 = __importDefault(require("../../config/configPrisma"));
const generateRandomValues_1 = __importDefault(require("../../utils/generateRandomValues"));
const callback = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!req.user) {
        return next(new HttpError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, http_status_codes_1.ReasonPhrases.UNAUTHORIZED));
    }
    const userType = req.user;
    const user = {
        displayName: userType.displayName,
        name: userType.username,
        image: userType.photos[0].value,
        email: userType._json.email,
        emailVerified: true,
        provider: userType.provider,
    };
    // si user.emailVerified nya undefined kalo pake github provider
    // user.emailVerified = true;
    const isExist = yield (0, findUsersEmail_1.default)(user);
    try {
        if (!(isExist === null || isExist === void 0 ? void 0 : isExist.user)) {
            const email = yield configPrisma_1.default.users_email.create({
                data: {
                    email: user.email,
                    emailVerified: user.emailVerified,
                    provider: user.provider,
                },
            });
            const userAccount = yield configPrisma_1.default.user.create({
                data: {
                    username: user.displayName,
                    image: user.image,
                    password: yield (0, bcrypt_1.default)((0, generateRandomValues_1.default)()),
                    roleId: 2,
                    emailId: email.id,
                },
            });
            // const accessToken = accessTokenSign(userAccount.i
            yield configPrisma_1.default.account_token.deleteMany({
                where: {
                    userId: userAccount.id,
                },
            });
            const refreshToken = (0, jwt_1.refreshTokenSign)(userAccount.id);
            yield configPrisma_1.default.account_token.create({
                data: {
                    token: refreshToken,
                    userId: userAccount.id,
                    token_type: "Bearer",
                },
            });
            if (cookies[config_1.default.cookie.refreshToken.name]) {
                res.clearCookie(config_1.default.cookie.refreshToken.name, configCookie_1.clearRefreshTokenConfig);
            }
            res.cookie(config_1.default.cookie.refreshToken.name, refreshToken, configCookie_1.refreshTokenConfig);
            return res.redirect(config_1.default.redirect);
            // return res.json({
            //   success: true,
            //   payload: { accessToken },
            //   msg: null,
            // });
        }
        //   =======================
        //   end of else
        yield configPrisma_1.default.account_token.deleteMany({
            where: {
                userId: isExist.id,
            },
        });
        const refreshToken = (0, jwt_1.refreshTokenSign)(isExist.user.id);
        yield configPrisma_1.default.account_token.create({
            data: {
                token: refreshToken,
                userId: isExist.user.id,
                token_type: "Bearer",
            },
        });
        if (cookies[config_1.default.cookie.refreshToken.name]) {
            res.clearCookie(config_1.default.cookie.refreshToken.name, configCookie_1.clearRefreshTokenConfig);
        }
        res.cookie(config_1.default.cookie.refreshToken.name, refreshToken, configCookie_1.refreshTokenConfig);
        return res.redirect(config_1.default.redirect);
        // return res.json({
        //   success: true,
        //   payload: { accessToken },
        //   msg: null,
        // });
    }
    catch (e) {
        throw new HttpError_1.default(500, e.message);
    }
});
exports.githubCb = callback;
const failed = (req, res) => {
    res.json({ msg: "failed" });
};
exports.githubFailure = failed;

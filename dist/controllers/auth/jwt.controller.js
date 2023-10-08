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
exports.jwtRefresh = exports.jwtSignup = void 0;
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../config/config"));
const HttpError_1 = __importDefault(require("../../utils/errors/HttpError"));
const configCookie_1 = require("../../config/configCookie");
const jwt_1 = require("../../utils/jwt");
const configPrisma_1 = __importDefault(require("../../config/configPrisma"));
const jwtRefresh = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies[config_1.default.cookie.refreshToken.name];
    if (!token) {
        return next(new HttpError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, http_status_codes_1.ReasonPhrases.UNAUTHORIZED));
    }
    console.log(token);
    const getOldToken = yield configPrisma_1.default.account_token.findFirst({
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
        return next(new HttpError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, http_status_codes_1.ReasonPhrases.UNAUTHORIZED));
    }
    const accessToken = (0, jwt_1.accessTokenSign)(getOldToken === null || getOldToken === void 0 ? void 0 : getOldToken.userId);
    const refreshToken = (0, jwt_1.refreshTokenSign)(getOldToken === null || getOldToken === void 0 ? void 0 : getOldToken.userId);
    yield configPrisma_1.default.account_token.update({
        where: {
            token: getOldToken === null || getOldToken === void 0 ? void 0 : getOldToken.token,
        },
        data: {
            token: refreshToken,
        },
    });
    res.clearCookie(config_1.default.cookie.refreshToken.name, configCookie_1.clearRefreshTokenConfig);
    res.cookie(config_1.default.cookie.refreshToken.name, refreshToken, configCookie_1.refreshTokenConfig);
    return res.json({ success: true, payload: { accessToken }, msg: null });
});
exports.jwtRefresh = jwtRefresh;
const signup = (req, res) => {
    const body = req.body;
    console.log(body);
};
exports.jwtSignup = signup;

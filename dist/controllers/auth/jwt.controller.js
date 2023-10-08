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
    // disini tokennya sama dengan pemanggilan ke 1
    if (!token) {
        return next(new HttpError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, http_status_codes_1.ReasonPhrases.UNAUTHORIZED));
    }
    console.log("ini token ", token);
    res.clearCookie(config_1.default.cookie.refreshToken.name, configCookie_1.clearRefreshTokenConfig);
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
    //   jadi ketika mencari berdasarkan token, maka akan null
    console.log("old token ", getOldToken);
    console.log("coyy : ", getOldToken === null || getOldToken === void 0 ? void 0 : getOldToken.id);
    // cari usernya
    if (!getOldToken) {
        return next(new HttpError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, http_status_codes_1.ReasonPhrases.UNAUTHORIZED));
    }
    const accessToken = (0, jwt_1.accessTokenSign)(getOldToken === null || getOldToken === void 0 ? void 0 : getOldToken.userId);
    const refreshToken = (0, jwt_1.refreshTokenSign)(getOldToken === null || getOldToken === void 0 ? void 0 : getOldToken.userId);
    console.log(refreshToken + "  woei weoi fjwoiefj");
    try {
        yield configPrisma_1.default.account_token.create({
            data: {
                token: refreshToken,
                token_type: "Bearer",
                userId: getOldToken.userId,
            },
        });
    }
    catch (e) {
        console.log("error");
    }
    //   karena token yang ke 1 sudah diganti dengan yang baru
    console.log("trmksh");
    res.cookie(config_1.default.cookie.refreshToken.name, refreshToken, configCookie_1.refreshTokenConfig);
    console.log("trmksh2");
    return res.json({ success: true, payload: { accessToken }, msg: null });
});
exports.jwtRefresh = jwtRefresh;
const signup = (req, res) => {
    const body = req.body;
    console.log(body);
};
exports.jwtSignup = signup;

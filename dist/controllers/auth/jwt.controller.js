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
exports.jwtSignin = exports.jwtRefresh = exports.jwtSignup = void 0;
const bcrypt_1 = require("bcrypt");
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../config/config"));
const HttpError_1 = __importDefault(require("../../utils/errors/HttpError"));
const configCookie_1 = require("../../config/configCookie");
const jwt_1 = require("../../utils/jwt");
const configPrisma_1 = __importDefault(require("../../config/configPrisma"));
const findUsersEmail_1 = __importDefault(require("../../helper/create/findUsersEmail"));
const bcrypt_2 = __importDefault(require("../../utils/bcrypt"));
const findUserByUsername_1 = __importDefault(require("../../helper/create/findUserByUsername"));
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
    // cari usernya
    if (!getOldToken) {
        return next(new HttpError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, http_status_codes_1.ReasonPhrases.UNAUTHORIZED));
    }
    const accessToken = (0, jwt_1.accessTokenSign)(getOldToken === null || getOldToken === void 0 ? void 0 : getOldToken.userId);
    const refreshToken = (0, jwt_1.refreshTokenSign)(getOldToken === null || getOldToken === void 0 ? void 0 : getOldToken.userId);
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
        return next(e);
    }
    //   karena token yang ke 1 sudah diganti dengan yang baru
    res.cookie(config_1.default.cookie.refreshToken.name, refreshToken, configCookie_1.refreshTokenConfig);
    return res.json({ success: true, payload: { accessToken }, msg: null });
});
exports.jwtRefresh = jwtRefresh;
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    const user = req.body;
    const isExist = yield (0, findUserByUsername_1.default)(user.username);
    if (!isExist) {
        return next(new Error("Username or password wrong"));
    }
    const isSame = yield (0, bcrypt_1.compare)(user.password, isExist.password);
    if (!isSame) {
        return next(new Error("Username or password wrong"));
    }
    yield configPrisma_1.default.account_token.deleteMany({
        where: {
            userId: isExist.id,
        },
    });
    const refreshToken = (0, jwt_1.refreshTokenSign)(isExist.id);
    const accessToken = (0, jwt_1.accessTokenSign)(isExist.id);
    yield configPrisma_1.default.account_token.create({
        data: {
            token: refreshToken,
            userId: isExist.id,
            token_type: "Bearer",
        },
    });
    if (cookies[config_1.default.cookie.refreshToken.name]) {
        res.clearCookie(config_1.default.cookie.refreshToken.name, configCookie_1.clearRefreshTokenConfig);
    }
    res.cookie(config_1.default.cookie.refreshToken.name, refreshToken, configCookie_1.refreshTokenConfig);
    return res.json({
        success: true,
        payload: { accessToken },
        msg: null,
    });
});
exports.jwtSignin = signin;
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    if (user.password !== user.confirmPassword) {
        return res.json({
            success: false,
            payload: null,
            msg: "Confirmation password not same",
        });
    }
    const isExist = yield (0, findUsersEmail_1.default)({
        email: user.email,
        provider: "credentials",
    });
    if (isExist) {
        return next(new Error("User is exist"));
    }
    const email = yield configPrisma_1.default.users_email.create({
        data: {
            email: user.email,
            emailVerified: false,
            provider: "credentials",
        },
    });
    yield configPrisma_1.default.user.create({
        data: {
            username: user.username,
            image: "none",
            password: yield (0, bcrypt_2.default)(user.password),
            roleId: 2,
            emailId: email.id,
        },
    });
    return res.json({
        success: true,
        payload: null,
        msg: "User is created",
    });
});
exports.jwtSignup = signup;

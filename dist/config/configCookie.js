"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearRefreshTokenConfig = exports.refreshTokenConfig = void 0;
const config_1 = __importDefault(require("./config"));
const optionRefresh = config_1.default.env == "production"
    ? {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    }
    : {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
    };
const optionClearRefresh = config_1.default.env == "production"
    ? {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    }
    : {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
    };
exports.refreshTokenConfig = optionRefresh;
exports.clearRefreshTokenConfig = optionClearRefresh;

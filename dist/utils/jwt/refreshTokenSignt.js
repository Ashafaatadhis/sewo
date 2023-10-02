"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSign = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config/config"));
const refreshTokenSign = (id) => {
    return jsonwebtoken_1.default.sign({ id }, config_1.default.jwt.secret, { expiresIn: "24h" });
};
exports.refreshTokenSign = refreshTokenSign;

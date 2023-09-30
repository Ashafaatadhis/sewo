"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const config_1 = __importDefault(require("../config/config"));
let setting = "";
if (config_1.default.env === "production") {
    setting = "combined";
}
else if (config_1.default.env === "development") {
    setting = "dev";
}
exports.default = (0, morgan_1.default)(setting);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("./routes/api"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const logger_1 = __importDefault(require("./middleware/logger"));
const app = (0, express_1.default)();
app.use(logger_1.default);
app.use(api_1.default);
app.use(errorHandler_1.default);
exports.default = app;

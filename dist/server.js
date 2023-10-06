"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const logger_1 = __importDefault(require("./middleware/logger"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(logger_1.default);
app.use(express_1.default.json());
app.use((0, cors_1.default)({ credentials: true, origin: ["http://localhost:3000"] }));
app.use((0, cookie_parser_1.default)());
app.use(routes_1.default);
app.use(errorHandler_1.default);
exports.default = app;

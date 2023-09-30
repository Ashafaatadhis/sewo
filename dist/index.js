"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const config_1 = __importDefault(require("./config/config"));
server_1.default.listen(config_1.default.port, () => {
    console.log(`Server is running on ${config_1.default.port}`);
});

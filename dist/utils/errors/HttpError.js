"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_custom_error_1 = require("ts-custom-error");
class HttpError extends ts_custom_error_1.CustomError {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
exports.default = HttpError;

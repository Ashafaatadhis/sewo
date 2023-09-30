"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    if (err) {
        res.status(err.code).json({ success: false, msg: err.message });
    }
};
exports.default = errorHandler;

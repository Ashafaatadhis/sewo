"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    if (err.code) {
        return res.status(err.code).json({ success: false, msg: err.message });
    }
    return res.json({ success: false, msg: err.message });
};
exports.default = errorHandler;

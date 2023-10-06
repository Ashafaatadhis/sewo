"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateRandomString = () => {
    return (Math.floor(Math.random() * Date.now()).toString(36) +
        Math.floor(Math.random() * Date.now()).toString(36) +
        Math.floor(Math.random() * Date.now()).toString(36));
};
exports.default = generateRandomString;

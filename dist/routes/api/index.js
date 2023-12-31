"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const auth_2 = __importDefault(require("../../middleware/auth"));
const _protected_1 = require("./(protected)");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.send({ msg: "tfeds" });
});
router.use("/auth", auth_1.default);
router.use("/user", auth_2.default.authenticate("jwt", { session: false }), _protected_1.user);
exports.default = router;

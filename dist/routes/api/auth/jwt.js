"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_controller_1 = require("../../../controllers/auth/jwt.controller");
const router = express_1.default.Router();
router.get("/signin");
router.post("/signup", jwt_controller_1.jwtSignup);
router.get("/refresh", jwt_controller_1.jwtRefresh);
exports.default = router;

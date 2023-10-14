"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_controller_1 = require("../../../controllers/auth/jwt.controller");
const validation_1 = __importDefault(require("../../../middleware/validation"));
const registerSchema_1 = __importDefault(require("../../../helper/schema/registerSchema"));
const loginSchema_1 = __importDefault(require("../../../helper/schema/loginSchema"));
const router = express_1.default.Router();
router.post("/signin", (0, validation_1.default)(loginSchema_1.default), jwt_controller_1.jwtSignin);
router.post("/signup", (0, validation_1.default)(registerSchema_1.default), jwt_controller_1.jwtSignup);
router.get("/refresh", jwt_controller_1.jwtRefresh);
exports.default = router;

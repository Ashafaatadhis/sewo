"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const google_1 = __importDefault(require("./google"));
const github_1 = __importDefault(require("./github"));
const jwt_1 = __importDefault(require("./jwt"));
const test_1 = __importDefault(require("./test"));
const router = express_1.default.Router();
router.use("/", jwt_1.default);
router.use("/google", google_1.default);
router.use("/github", github_1.default);
router.use("/test", test_1.default);
exports.default = router;

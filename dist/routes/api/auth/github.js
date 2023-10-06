"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middleware/auth"));
const github_controller_1 = require("../../../controllers/auth/github.controller");
const router = express_1.default.Router();
router.get("/", auth_1.default.authenticate("github", { scope: ["user:email"] }));
router.get("/callback", auth_1.default.authenticate("github", {
    failureRedirect: "/api/auth/google/failure",
    session: false,
}), github_controller_1.githubCb);
router.get("/failure", github_controller_1.githubFailure);
exports.default = router;

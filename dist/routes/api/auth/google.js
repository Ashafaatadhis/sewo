"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middleware/auth"));
const google_controller_1 = require("../../../controllers/auth/google.controller");
const router = express_1.default.Router();
router.get("/", auth_1.default.authenticate("google", {
    scope: ["profile", "email"],
}));
router.get("/callback", auth_1.default.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
    session: false,
}), google_controller_1.googleCb);
router.get("/failure", google_controller_1.googleFailure);
exports.default = router;

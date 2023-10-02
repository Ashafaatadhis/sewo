"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middleware/auth"));
const jwt_1 = require("../../../utils/jwt");
const configPrisma_1 = __importDefault(require("../../../config/configPrisma"));
const HttpError_1 = __importDefault(require("../../../utils/errors/HttpError"));
const findUsersEmail_1 = __importDefault(require("../../../helper/create/findUsersEmail"));
const router = express_1.default.Router();
router.get("/", auth_1.default.authenticate("google", {
    scope: ["profile", "email"],
}));
router.get("/callback", auth_1.default.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
    session: false,
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return;
    }
    const userType = req.user;
    const user = {
        displayName: userType.displayName,
        name: userType.name.givenName,
        image: userType.photos[0].value,
        email: userType._json.email,
        emailVerified: userType.email_verified,
        provider: userType.provider,
    };
    const isExist = yield (0, findUsersEmail_1.default)(user);
    try {
        if (!(isExist === null || isExist === void 0 ? void 0 : isExist.user)) {
            const email = yield configPrisma_1.default.users_email.create({
                data: {
                    email: user.email,
                    emailVerified: user.emailVerified,
                    provider: user.provider,
                },
            });
            const userAccount = yield configPrisma_1.default.user.create({
                data: {
                    name: user.displayName,
                    roleId: 2,
                    emailId: email.id,
                },
            });
            const accessToken = (0, jwt_1.accessTokenSign)(userAccount.id);
            const refreshToken = (0, jwt_1.refreshTokenSign)(userAccount.id);
            const accountToken = yield configPrisma_1.default.account_token.create({
                data: {
                    token: refreshToken,
                    userId: userAccount.id,
                    token_type: "Bearer",
                },
            });
            yield configPrisma_1.default.account.create({
                data: {
                    username: user.name,
                    provider: user.provider,
                    userId: userAccount.id,
                    tokenId: accountToken.id,
                },
            });
            return res.json({
                success: true,
                payload: { accessToken, refreshToken },
                msg: null,
            });
        }
        //   =======================
        //   end of else
        const getOldToken = yield configPrisma_1.default.account_token.findFirst({
            where: {
                user: {
                    email: {
                        AND: {
                            email: user.email,
                            provider: user.provider,
                        },
                    },
                },
            },
        });
        const accessToken = (0, jwt_1.accessTokenSign)(isExist.user.id);
        const refreshToken = (0, jwt_1.refreshTokenSign)(isExist.user.id);
        const accountToken = yield configPrisma_1.default.account_token.upsert({
            where: {
                token: getOldToken === null || getOldToken === void 0 ? void 0 : getOldToken.token,
            },
            update: {
                token: refreshToken,
            },
            create: {
                token: refreshToken,
                token_type: "Bearer",
                userId: isExist.user.id,
            },
        });
        configPrisma_1.default.account.upsert({
            where: {
                tokenId: accountToken.id,
            },
            update: {
                tokenId: accountToken.id,
            },
            create: {
                username: user.name,
                provider: user.provider,
                userId: isExist.user.id,
                tokenId: accountToken.id,
            },
        });
        return res.json({
            success: true,
            payload: { accessToken, refreshToken },
            msg: null,
        });
    }
    catch (e) {
        throw new HttpError_1.default(500, e.message);
    }
}));
router.get("/failure", (req, res) => {
    res.json({ success: false, payload: null, msg: "failure" });
});
exports.default = router;

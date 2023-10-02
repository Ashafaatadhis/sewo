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
const configPrisma_1 = __importDefault(require("../../config/configPrisma"));
exports.default = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield configPrisma_1.default.users_email.findFirst({
        where: {
            AND: {
                email: user.email,
                provider: user.provider,
            },
        },
        select: {
            user: {
                select: {
                    id: true,
                },
            },
        },
    });
    return isExist;
});

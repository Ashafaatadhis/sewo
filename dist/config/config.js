"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const joi_1 = __importDefault(require("joi"));
dotenv_1.default.config();
const envVarsSchema = joi_1.default
    .object()
    .keys({
    NODE_ENV: joi_1.default
        .string()
        .valid("production", "development", "test")
        .required(),
    PORT: joi_1.default.number().positive().required(),
    GOOGLE_CLIENT_ID: joi_1.default.string().required(),
    GOOGLE_CLIENT_SECRET: joi_1.default.string().required(),
    GITHUB_CLIENT_ID: joi_1.default.string().required(),
    GITHUB_CLIENT_SECRET: joi_1.default.string().required(),
    JWT_SECRET: joi_1.default.string().required(),
})
    .unknown();
const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: "key" } })
    .validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
exports.default = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    auth: {
        google: {
            google_client_id: envVars.GOOGLE_CLIENT_ID,
            google_client_secret: envVars.GOOGLE_CLIENT_SECRET,
        },
        github: {
            github_client_id: envVars.GITHUB_CLIENT_ID,
            github_client_secret: envVars.GITHUB_CLIENT_SECRET,
        },
    },
    jwt: {
        secret: envVars.JWT_SECRET,
    },
};

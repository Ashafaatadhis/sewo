"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string({
            required_error: "Username is required",
        }),
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email("Not a valid email"),
        password: zod_1.z.string({
            required_error: "Password is required",
        }),
        confirmPassword: zod_1.z.string({
            required_error: "Confirmation password is required",
        }),
    }),
});
exports.default = registerSchema;

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
    }),
});
exports.default = registerSchema;

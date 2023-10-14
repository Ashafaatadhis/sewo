import { z } from "zod";
const loginSchema = z.object({
  body: z.object({
    username: z.string({
      required_error: "Username is required",
    }),

    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

export default loginSchema;

import { z } from "zod";
const registerSchema = z.object({
  body: z.object({
    username: z.string({
      required_error: "Username is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Not a valid email"),
    password: z.string({
      required_error: "Password is required",
    }),
    confirmPassword: z.string({
      required_error: "Confirmation password is required",
    }),
  }),
});

export default registerSchema;

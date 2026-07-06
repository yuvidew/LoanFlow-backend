import { z } from "zod";

// Validates login credentials before authentication.
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>["body"];

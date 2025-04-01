import { z } from "zod";

export const User = z.object({
  email: z.string().min(2, "Name should be atleast 2 characters"),
  password: z
    .string()
    .min(6, "Password should be at least 6 characters")
    .max(20, "Password should not be longer than 20 characters"),
});

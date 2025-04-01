import { z } from "zod";

export const User = z
  .object({
    name: z.string().min(2, "Name should be atleast 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password should be at least 6 characters")
      .max(20, "Password should not be longer than 20 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password should be at least 6 characters")
      .max(20, "Password should not be longer than 20 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

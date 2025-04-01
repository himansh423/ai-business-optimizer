import { z } from "zod";


export const Email = z.object({
  email: z.string().email("Invalid email address"),
})
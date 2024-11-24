import { z } from "zod";

export const createUserSchema = z
  .object({
    name: z.string().min(2).max(10),
    email: z.string().email(),
    password: z.string(),
    age: z.number().positive(),
  })
  .required();

export type CreateUserZodDTO = z.infer<typeof createUserSchema>;

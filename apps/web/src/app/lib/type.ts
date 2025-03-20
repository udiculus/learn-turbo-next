import { z } from 'zod';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type FormState<T = Record<string, string>> =
  | {
      error?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
      payload?: T;
    }
  | undefined;

export const SignUpFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .trim(),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .trim(),
  password: z
    .string()
    .min(8, { message: 'Contain at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter' })
    .regex(/[0-9]/, { message: 'Contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character',
    })
    .trim(),
});

export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .trim(),
  password: z
    .string()
    .min(1, { message: 'Password field must not be empty.' })
    .trim(),
});

export enum Role {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  USER = 'USER',
}

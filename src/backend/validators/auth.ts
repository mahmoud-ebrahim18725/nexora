import { z } from "zod";
import {
  MAX_NAME_LENGTH,
  MAX_PASSWORD_LENGTH,
  emailField,
} from "./common";

export const registerSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, { message: "Company name is required" })
    .max(MAX_NAME_LENGTH),
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(MAX_NAME_LENGTH),
  email: emailField,
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(MAX_PASSWORD_LENGTH),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(8).max(MAX_PASSWORD_LENGTH),
});

export type LoginInput = z.infer<typeof loginSchema>;

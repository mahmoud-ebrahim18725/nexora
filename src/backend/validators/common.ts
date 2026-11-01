import { z } from "zod";

const MAX_INT = 2147483647;

export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_PASSWORD_LENGTH = 128;
export const MAX_TITLE_LENGTH = 200;
export const MAX_TEXT_LENGTH = 5000;

export const idParam = z.coerce.number().int().positive().max(MAX_INT);

export const bodyId = z.number().int().positive().max(MAX_INT);

export const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .max(MAX_EMAIL_LENGTH)
  .email({ message: "Invalid email address" });

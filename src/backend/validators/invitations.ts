import { z } from "zod";
import { INVITABLE_ROLES } from "@/backend/constants/roles";
import {
  MAX_NAME_LENGTH,
  MAX_PASSWORD_LENGTH,
  emailField,
  idParam,
} from "./common";

export const createInvitationSchema = z.object({
  email: emailField,
  role: z.enum(Object.values(INVITABLE_ROLES)),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;

export const acceptInvitationSchema = z.object({
  id: idParam,
  token: z.string().length(64),
  name: z.string().trim().min(1).max(MAX_NAME_LENGTH),
  password: z.string().min(8).max(MAX_PASSWORD_LENGTH),
});

export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;

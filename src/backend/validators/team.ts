import { z } from "zod";
import { CHANGEABLE_ROLES } from "@/backend/constants";
import { idParam } from "./common";

export const changeMemberRoleSchema = z.object({
  memberId: idParam,
  role: z.enum(Object.values(CHANGEABLE_ROLES)),
});

export const memberIdSchema = z.object({
  id: idParam,
});

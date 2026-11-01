import { prisma } from "@/backend/lib/prisma";
import { requireRole } from "@/backend/auth";
import { ROLES } from "@/backend/constants";
import { paginationArgs } from "@/backend/lib/pagination";
import type { PaginationInput } from "@/backend/validators";

export async function listMembers(pagination: PaginationInput) {
  const user = await requireRole([ROLES.ADMIN, ROLES.OWNER]);
  const where = {
    companyId: user.companyId,
  };
  const [members, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: {
        id: "asc",
      },
      ...paginationArgs(pagination),
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    }),
    prisma.user.count({
      where,
    }),
  ]);
  return { members, pagination: { ...pagination, total } };
}

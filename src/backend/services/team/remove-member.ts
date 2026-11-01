import { prisma } from "@/backend/lib/prisma";
import { requireRole } from "@/backend/auth";
import { ROLES, ERROR_CODES, PROJECT_ROLES } from "@/backend/constants";
import { AppError } from "@/backend/errors/app-error";

export async function removeMember(memberId: number) {
  const currentUser = await requireRole([ROLES.OWNER, ROLES.ADMIN]);
  const member = await prisma.user.findUnique({
    where: {
      id: memberId,
    },
  });
  if (!member) {
    throw new AppError("Member not found", 404, ERROR_CODES.NOT_FOUND);
  }
  if (member.companyId !== currentUser.companyId) {
    throw new AppError("Member not found", 404, ERROR_CODES.NOT_FOUND);
  }
  if (member.role === ROLES.OWNER) {
    throw new AppError("Owner cannot be removed", 403, ERROR_CODES.FORBIDDEN);
  }
  if (member.role === ROLES.ADMIN && currentUser.role === ROLES.ADMIN) {
    throw new AppError("Admin cannot be removed", 403, ERROR_CODES.FORBIDDEN);
  }
  const managedProjects = await prisma.project.findMany({
    where: {
      companyId: currentUser.companyId,
      projectMembers: {
        some: {
          userId: memberId,
          projectRole: PROJECT_ROLES.MANAGER,
        },
      },
    },
    select: {
      name: true,
      _count: {
        select: {
          projectMembers: {
            where: {
              projectRole: PROJECT_ROLES.MANAGER,
            },
          },
        },
      },
    },
  });
  const soleManagerOf = managedProjects.filter(
    (project) => project._count.projectMembers <= 1,
  );
  if (soleManagerOf.length > 0) {
    throw new AppError(
      "Cannot remove last manager",
      409,
      ERROR_CODES.CONFLICT,
      {
        projects: soleManagerOf.map((project) => project.name).join(", "),
      },
    );
  }
  await prisma.user.delete({
    where: {
      id: memberId,
    },
  });
  return "Member removed successfully";
}

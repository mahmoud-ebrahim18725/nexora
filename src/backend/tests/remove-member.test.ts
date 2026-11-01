import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireRole: vi.fn(),
  requireAuth: vi.fn(),
  findUnique: vi.fn(),
  findManyProjects: vi.fn(),
  deleteUser: vi.fn(),
  findProjectById: vi.fn(),
  findProjectMember: vi.fn(),
  findProjectManager: vi.fn(),
  managersCount: vi.fn(),
  updateTasks: vi.fn(),
  deleteMembership: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("@/backend/auth", () => ({
  requireRole: mocks.requireRole,
  requireAuth: mocks.requireAuth,
}));
vi.mock("@/backend/auth/require-auth", () => ({
  requireAuth: mocks.requireAuth,
}));
vi.mock("@/backend/repositories", () => ({
  findProjectById: mocks.findProjectById,
  findProjectMember: mocks.findProjectMember,
  findProjectManager: mocks.findProjectManager,
  managersCount: mocks.managersCount,
}));
vi.mock("@/backend/lib/prisma", () => ({
  prisma: {
    user: { findUnique: mocks.findUnique, delete: mocks.deleteUser },
    project: { findMany: mocks.findManyProjects },
    task: { updateMany: mocks.updateTasks },
    projectMember: { delete: mocks.deleteMembership },
    $transaction: mocks.transaction,
  },
}));

import { removeMember } from "@/backend/services/team/remove-member";
import { removeProjectMember } from "@/backend/services/project-members";

const owner = { id: 1, role: "owner", companyId: 1 };

beforeEach(() => {
  vi.clearAllMocks();
  mocks.requireRole.mockResolvedValue(owner);
  mocks.requireAuth.mockResolvedValue(owner);
  mocks.findUnique.mockResolvedValue({ id: 2, role: "member", companyId: 1 });
  mocks.findManyProjects.mockResolvedValue([]);
  mocks.findProjectById.mockResolvedValue({ id: 1 });
  mocks.findProjectMember.mockResolvedValue({ projectRole: "member" });
});

describe("removeMember", () => {
  it("removes a member who is not a sole manager", async () => {
    mocks.findManyProjects.mockResolvedValue([
      { name: "Shared", _count: { projectMembers: 2 } },
    ]);
    await expect(removeMember(2)).resolves.toBe("Member removed successfully");
    expect(mocks.deleteUser).toHaveBeenCalledOnce();
  });

  it("blocks removing the last manager of a project", async () => {
    mocks.findManyProjects.mockResolvedValue([
      { name: "Apollo", _count: { projectMembers: 1 } },
    ]);
    await expect(removeMember(2)).rejects.toMatchObject({
      statusCode: 409,
      details: { projects: "Apollo" },
    });
    expect(mocks.deleteUser).not.toHaveBeenCalled();
  });
});

describe("removeProjectMember", () => {
  it("unassigns the member's tasks in the same transaction", async () => {
    await removeProjectMember(2, 1);
    expect(mocks.transaction).toHaveBeenCalledOnce();
    expect(mocks.updateTasks).toHaveBeenCalledWith({
      where: { projectId: 1, assignedTo: 2 },
      data: { assignedTo: null },
    });
    expect(mocks.deleteMembership).toHaveBeenCalledOnce();
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  findProjectById: vi.fn(),
  findTask: vi.fn(),
  findProjectManager: vi.fn(),
  findProjectMember: vi.fn(),
  update: vi.fn(),
}));

vi.mock("@/backend/auth", () => ({ requireAuth: mocks.requireAuth }));
vi.mock("@/backend/repositories", () => ({
  findProjectById: mocks.findProjectById,
  findTask: mocks.findTask,
  findProjectManager: mocks.findProjectManager,
  findProjectMember: mocks.findProjectMember,
}));
vi.mock("@/backend/lib/prisma", () => ({
  prisma: { task: { update: mocks.update } },
}));

import { updateTask } from "@/backend/services/tasks/update-task";

const assignee = { id: 5, role: "member", companyId: 1 };

beforeEach(() => {
  vi.clearAllMocks();
  mocks.requireAuth.mockResolvedValue(assignee);
  mocks.findProjectById.mockResolvedValue({ id: 1 });
  mocks.findTask.mockResolvedValue({ id: 2, assignedTo: assignee.id });
  mocks.findProjectManager.mockResolvedValue(null);
  mocks.findProjectMember.mockResolvedValue({ userId: assignee.id });
  mocks.update.mockImplementation(({ data }) => ({ id: 2, ...data }));
});

describe("updateTask", () => {
  it("lets the assignee change the status", async () => {
    const task = await updateTask(1, 2, { status: "completed" });
    expect(task.status).toBe("completed");
  });

  it("blocks an assignee who was removed from the project", async () => {
    mocks.findProjectMember.mockResolvedValue(null);
    await expect(updateTask(1, 2, { status: "completed" })).rejects.toMatchObject({
      statusCode: 403,
    });
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it("blocks the assignee from changing other fields", async () => {
    await expect(updateTask(1, 2, { title: "New" })).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it("lets a manager clear the assignee and the due date", async () => {
    mocks.findProjectManager.mockResolvedValue({ userId: assignee.id });
    await updateTask(1, 2, { assignedTo: null, dueDate: null });
    expect(mocks.update.mock.calls[0][0].data).toEqual({
      assignedTo: null,
      dueDate: null,
    });
  });

  it("accepts a due date of today", async () => {
    mocks.findProjectManager.mockResolvedValue({ userId: assignee.id });
    const today = new Date(new Date().toISOString().slice(0, 10));
    await expect(updateTask(1, 2, { dueDate: today })).resolves.toBeDefined();
  });

  it("rejects a due date before today", async () => {
    mocks.findProjectManager.mockResolvedValue({ userId: assignee.id });
    const dueDate = new Date(Date.now() - 1000 * 60 * 60 * 48);
    await expect(updateTask(1, 2, { dueDate })).rejects.toMatchObject({
      statusCode: 400,
    });
  });
});

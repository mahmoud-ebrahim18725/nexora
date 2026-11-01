import { describe, expect, it } from "vitest";
import {
  acceptInvitationSchema,
  createTaskSchema,
  getTaskSchema,
  loginSchema,
  paginationSchema,
  registerSchema,
  updateProjectSchema,
  updateTaskSchema,
} from "@/backend/validators";

describe("email", () => {
  it("is lowercased on login and register", () => {
    const login = loginSchema.parse({
      email: " Foo@X.com ",
      password: "password1",
    });
    expect(login.email).toBe("foo@x.com");
    const register = registerSchema.parse({
      companyName: "Acme",
      name: "Sam",
      email: "Foo@X.com",
      password: "password1",
    });
    expect(register.email).toBe("foo@x.com");
  });
});

describe("ids", () => {
  it("rejects ids that do not fit in an Int column", () => {
    const result = getTaskSchema.safeParse({
      projectId: "99999999999",
      taskId: "1",
    });
    expect(result.success).toBe(false);
  });

  it("does not coerce booleans into ids", () => {
    expect(updateTaskSchema.safeParse({ assignedTo: true }).success).toBe(false);
  });
});

describe("updateTaskSchema", () => {
  it("allows clearing optional fields with null", () => {
    const data = updateTaskSchema.parse({
      assignedTo: null,
      dueDate: null,
      description: null,
    });
    expect(data).toEqual({ assignedTo: null, dueDate: null, description: null });
  });

  it("keeps absent fields out of the result", () => {
    expect(Object.keys(updateTaskSchema.parse({}))).toEqual([]);
  });
});

describe("createTaskSchema", () => {
  const task = { projectId: "1", title: "Task", priority: "low" };

  it("accepts date-only and date-time due dates", () => {
    for (const dueDate of ["2030-01-02", "2030-01-02T10:00:00.000Z"]) {
      expect(createTaskSchema.safeParse({ ...task, dueDate }).success).toBe(true);
    }
  });

  it("rejects a null due date instead of turning it into 1970", () => {
    const result = createTaskSchema.safeParse({ ...task, dueDate: null });
    expect(result.success).toBe(false);
  });
});

describe("updateProjectSchema", () => {
  it("returns no keys for an empty body", () => {
    expect(Object.keys(updateProjectSchema.parse({}))).toEqual([]);
  });

  it("allows clearing the description", () => {
    expect(updateProjectSchema.parse({ description: null })).toEqual({
      description: null,
    });
  });
});

describe("length limits", () => {
  it("rejects values above the maximum", () => {
    const long = "a".repeat(201);
    expect(updateTaskSchema.safeParse({ title: long }).success).toBe(false);
    const result = acceptInvitationSchema.safeParse({
      id: 1,
      token: "a".repeat(64),
      name: "Sam",
      password: "a".repeat(129),
    });
    expect(result.success).toBe(false);
  });
});

describe("paginationSchema", () => {
  it("applies defaults", () => {
    expect(paginationSchema.parse({})).toEqual({ page: 1, limit: 20 });
  });

  it("rejects a limit above 100", () => {
    expect(paginationSchema.safeParse({ limit: "101" }).success).toBe(false);
  });
});

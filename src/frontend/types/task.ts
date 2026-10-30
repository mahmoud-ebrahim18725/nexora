export type TaskStatus = "todo" | "in_progress" | "completed";

export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  assignedTo: number | null;
  dueDate: string | null;
  status: TaskStatus;
};

export type CreateTaskInput = {
  title: string;
  description?: string;
  priority: TaskPriority;
  assignedTo?: number;
  dueDate?: string;
};

export type UpdateTaskInput = Partial<CreateTaskInput> & {
  status?: TaskStatus;
};

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
  } | null;
};

import { api, fetchAll } from "../lib/api-client";
import type {
  Comment,
  Pagination,
  Task,
  TaskPriority,
  TaskStatus,
} from "../types";

type TaskInput = {
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  assignedTo?: number | null;
  dueDate?: string | null;
  status?: TaskStatus;
};

export function listTasks(projectId: number) {
  return fetchAll<Task>(
    `/projects/${projectId}/tasks`,
    (data: { tasks: Task[]; pagination: Pagination }) => ({
      items: data.tasks,
      total: data.pagination.total,
    }),
  );
}

export function createTask(projectId: number, body: TaskInput) {
  return api(`/projects/${projectId}/tasks`, { method: "POST", body });
}

export function updateTask(projectId: number, taskId: number, body: TaskInput) {
  return api(`/projects/${projectId}/tasks/${taskId}`, {
    method: "PATCH",
    body,
  });
}

export function deleteTask(projectId: number, taskId: number) {
  return api(`/projects/${projectId}/tasks/${taskId}`, { method: "DELETE" });
}

export function listComments(projectId: number, taskId: number) {
  return fetchAll<Comment>(
    `/projects/${projectId}/tasks/${taskId}/comments`,
    (data: { comments: Comment[]; pagination: Pagination }) => ({
      items: data.comments,
      total: data.pagination.total,
    }),
  );
}

export function createComment(
  projectId: number,
  taskId: number,
  content: string,
) {
  return api(`/projects/${projectId}/tasks/${taskId}/comments`, {
    method: "POST",
    body: { content },
  });
}

export function updateComment(
  projectId: number,
  taskId: number,
  commentId: number,
  content: string,
) {
  return api(`/projects/${projectId}/tasks/${taskId}/comments/${commentId}`, {
    method: "PATCH",
    body: { content },
  });
}

export function deleteComment(
  projectId: number,
  taskId: number,
  commentId: number,
) {
  return api(`/projects/${projectId}/tasks/${taskId}/comments/${commentId}`, {
    method: "DELETE",
  });
}

import apiClient from "../lib/api-client";
import type {
  Comment,
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from "@/frontend/types/task";

export async function listTasks(projectId: number): Promise<Task[]> {
  const response = await apiClient.get<{ tasks: Task[] }>(
    `/api/projects/${projectId}/tasks`,
  );
  return response.tasks;
}

export async function createTask(
  projectId: number,
  input: CreateTaskInput,
): Promise<Task> {
  const response = await apiClient.post<{ task: Task }>(
    `/api/projects/${projectId}/tasks`,
    input,
  );
  return response.task;
}

export async function updateTask(
  projectId: number,
  taskId: number,
  input: UpdateTaskInput,
): Promise<Task> {
  const response = await apiClient.patch<{ task: Task }>(
    `/api/projects/${projectId}/tasks/${taskId}`,
    input,
  );
  return response.task;
}

export async function deleteTask(
  projectId: number,
  taskId: number,
): Promise<void> {
  await apiClient.delete(`/api/projects/${projectId}/tasks/${taskId}`);
}

export async function listComments(
  projectId: number,
  taskId: number,
): Promise<Comment[]> {
  const response = await apiClient.get<{ comments: Comment[] }>(
    `/api/projects/${projectId}/tasks/${taskId}/comments`,
  );
  return response.comments;
}

export async function createComment(
  projectId: number,
  taskId: number,
  content: string,
): Promise<void> {
  await apiClient.post(`/api/projects/${projectId}/tasks/${taskId}/comments`, {
    content,
  });
}

export async function updateComment(
  projectId: number,
  taskId: number,
  commentId: number,
  content: string,
): Promise<void> {
  await apiClient.patch(
    `/api/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
    { content },
  );
}

export async function deleteComment(
  projectId: number,
  taskId: number,
  commentId: number,
): Promise<void> {
  await apiClient.delete(
    `/api/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
  );
}

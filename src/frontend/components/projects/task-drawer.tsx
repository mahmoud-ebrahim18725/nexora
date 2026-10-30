"use client";

import { useEffect, useState } from "react";
import Avatar from "@/frontend/components/ui/avatar";
import Badge from "@/frontend/components/ui/badge";
import Button from "@/frontend/components/ui/button";
import { inputClasses } from "@/frontend/components/ui/field";
import TaskComments from "./task-comments";
import { formatDate, formatLabel, isOverdue } from "@/frontend/lib/format";
import { getErrorMessage } from "@/frontend/lib/use-resource";
import { updateTask } from "@/frontend/services/task-services";
import type { ProjectMember } from "@/frontend/types/project";
import type { Task, TaskStatus } from "@/frontend/types/task";

const statuses: TaskStatus[] = ["todo", "in_progress", "completed"];

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-center gap-3 py-2">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="min-w-0 text-sm text-gray-900">{children}</dd>
    </div>
  );
}

export default function TaskDrawer({
  projectId,
  task,
  members,
  currentUserId,
  canManage,
  canComment,
  onClose,
  onEdit,
  onDelete,
  onChanged,
}: {
  projectId: number;
  task: Task;
  members: ProjectMember[];
  currentUserId: number;
  canManage: boolean;
  canComment: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onChanged: () => void;
}) {
  const [statusError, setStatusError] = useState("");
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const assignee = members.find((member) => member.id === task.assignedTo);
  const canChangeStatus = canManage || task.assignedTo === currentUserId;
  const overdue = isOverdue(task.dueDate, task.status);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleStatusChange(status: TaskStatus) {
    setStatusError("");
    setIsSavingStatus(true);
    try {
      await updateTask(projectId, task.id, { status });
      onChanged();
    } catch (caughtError) {
      setStatusError(getErrorMessage(caughtError));
    } finally {
      setIsSavingStatus(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label="Close task"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/30"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-drawer-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-2xl shadow-gray-900/20"
      >
        <header className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
              Task #{task.id}
            </p>
            <h2
              id="task-drawer-title"
              className="mt-1 text-lg leading-7 font-semibold break-words text-gray-900"
            >
              {task.title}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {canManage && (
              <>
                <Button size="sm" variant="secondary" onClick={onEdit}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDelete}
                  aria-label="Delete task"
                  className="hover:text-red-600"
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 7h14M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                    />
                  </svg>
                </Button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
          <dl className="divide-y divide-gray-100">
            <DetailRow label="Status">
              {canChangeStatus ? (
                <select
                  value={task.status}
                  disabled={isSavingStatus}
                  onChange={(event) =>
                    handleStatusChange(event.target.value as TaskStatus)
                  }
                  aria-label="Task status"
                  className={`${inputClasses} h-9 max-w-48`}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {formatLabel(status)}
                    </option>
                  ))}
                </select>
              ) : (
                <Badge value={task.status} withDot />
              )}
              {statusError && (
                <p className="mt-1 text-xs text-red-600">{statusError}</p>
              )}
            </DetailRow>
            <DetailRow label="Priority">
              <Badge value={task.priority} />
            </DetailRow>
            <DetailRow label="Assignee">
              {assignee ? (
                <span className="flex items-center gap-2">
                  <Avatar name={assignee.name} id={assignee.id} size="sm" />
                  <span className="truncate">
                    {assignee.name}
                    {assignee.id === currentUserId && (
                      <span className="text-gray-400"> (you)</span>
                    )}
                  </span>
                </span>
              ) : (
                <span className="text-gray-400">Unassigned</span>
              )}
            </DetailRow>
            <DetailRow label="Due date">
              {task.dueDate ? (
                <span className={overdue ? "font-medium text-red-600" : ""}>
                  {formatDate(task.dueDate)}
                  {overdue && " · Overdue"}
                </span>
              ) : (
                <span className="text-gray-400">No due date</span>
              )}
            </DetailRow>
          </dl>

          <section>
            <h3 className="text-sm font-semibold text-gray-900">Description</h3>
            <p className="mt-2 text-sm leading-6 whitespace-pre-wrap text-gray-600">
              {task.description || (
                <span className="text-gray-400">No description.</span>
              )}
            </p>
          </section>

          <div className="border-t border-gray-100 pt-6">
            <TaskComments
              projectId={projectId}
              taskId={task.id}
              currentUserId={currentUserId}
              canComment={canComment}
              canModerate={canManage}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

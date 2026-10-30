"use client";

import { useState } from "react";
import Modal from "@/frontend/components/ui/modal";
import Button from "@/frontend/components/ui/button";
import Field, { FormError, inputClasses } from "@/frontend/components/ui/field";
import { createTask, updateTask } from "@/frontend/services/task-services";
import { getErrorMessage } from "@/frontend/lib/use-resource";
import {
  formatLabel,
  toDateInputValue,
  toDueDateValue,
  todayInputValue,
} from "@/frontend/lib/format";
import type { ProjectMember } from "@/frontend/types/project";
import type {
  Task,
  TaskPriority,
  UpdateTaskInput,
} from "@/frontend/types/task";

const priorities: TaskPriority[] = ["low", "medium", "high"];

export default function TaskFormModal({
  projectId,
  members,
  task,
  onClose,
  onSaved,
}: {
  projectId: number;
  members: ProjectMember[];
  task?: Task;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority ?? "medium",
  );
  const [assignedTo, setAssignedTo] = useState(
    task?.assignedTo ? String(task.assignedTo) : "",
  );
  const [dueDate, setDueDate] = useState(
    toDateInputValue(task?.dueDate ?? null),
  );
  const [titleError, setTitleError] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleClose() {
    if (!isLoading) onClose();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }
    setIsLoading(true);
    try {
      if (task) {
        // Only send what changed; the API rejects empty strings and past dates.
        const changes: UpdateTaskInput = {};
        if (title.trim() !== task.title) changes.title = title.trim();
        if (description.trim() && description.trim() !== task.description) {
          changes.description = description.trim();
        }
        if (priority !== task.priority) changes.priority = priority;
        if (assignedTo && Number(assignedTo) !== task.assignedTo) {
          changes.assignedTo = Number(assignedTo);
        }
        if (dueDate && dueDate !== toDateInputValue(task.dueDate)) {
          changes.dueDate = toDueDateValue(dueDate);
        }
        if (Object.keys(changes).length > 0) {
          await updateTask(projectId, task.id, changes);
        }
      } else {
        await createTask(projectId, {
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
          assignedTo: assignedTo ? Number(assignedTo) : undefined,
          dueDate: dueDate ? toDueDateValue(dueDate) : undefined,
        });
      }
      onSaved();
      onClose();
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      isOpen
      onClose={handleClose}
      title={task ? "Edit task" : "New task"}
      description={task ? undefined : "Add a task to this project's board."}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormError message={error} />
        <Field id="task-title" label="Title" error={titleError}>
          <input
            id="task-title"
            autoFocus
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setTitleError("");
            }}
            placeholder="What needs to be done?"
            aria-invalid={Boolean(titleError)}
            className={`${inputClasses} h-10`}
          />
        </Field>
        <Field id="task-description" label="Description" hint="Optional">
          <textarea
            id="task-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="Add more detail"
            className={`${inputClasses} resize-none py-2`}
          />
        </Field>
        <fieldset>
          <legend className="mb-1.5 block text-xs font-medium text-gray-700">
            Priority
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {priorities.map((value) => (
              <label
                key={value}
                className={`flex h-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500/30 ${priority === value ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  name="priority"
                  value={value}
                  checked={priority === value}
                  onChange={() => setPriority(value)}
                  className="sr-only"
                />
                {formatLabel(value)}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="task-assignee"
            label="Assignee"
            hint={
              members.length === 0 ? "Add project members first" : undefined
            }
          >
            <select
              id="task-assignee"
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
              className={`${inputClasses} h-10`}
            >
              {(!task || !task.assignedTo) && (
                <option value="">Unassigned</option>
              )}
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </Field>
          <Field id="task-due-date" label="Due date">
            <input
              id="task-due-date"
              type="date"
              min={todayInputValue()}
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className={`${inputClasses} h-10`}
            />
          </Field>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {task ? "Save changes" : "Create task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

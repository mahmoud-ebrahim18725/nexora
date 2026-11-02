"use client";

import type { FormEvent } from "react";
import { PRIORITY_LABELS, toDateInput } from "../../lib/format";
import { useSubmit } from "../../lib/use-submit";
import { createTask, updateTask } from "../../services/task-services";
import type { ProjectMember, Task, TaskPriority } from "../../types";
import { Button } from "../ui/button";
import { FormError, SelectField, TextAreaField, TextField } from "../ui/field";
import { Modal } from "../ui/modal";

export function TaskFormModal({
  projectId,
  task,
  members,
  onClose,
  onSaved,
}: {
  projectId: number;
  task?: Task;
  members: ProjectMember[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const { pending, error, run } = useSubmit();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      title: String(form.get("title")).trim(),
      description: String(form.get("description")).trim() || null,
      priority: form.get("priority") as TaskPriority,
      assignedTo: Number(form.get("assignedTo")) || null,
      dueDate: String(form.get("dueDate")) || null,
    };
    const done = await run(() => {
      if (!task) {
        return createTask(projectId, {
          title: values.title,
          priority: values.priority,
          description: values.description ?? undefined,
          assignedTo: values.assignedTo ?? undefined,
          dueDate: values.dueDate ?? undefined,
        });
      }
      // Only changed fields are sent, so an overdue task can still be renamed.
      const dueDate = toDateInput(task.dueDate) || null;
      return updateTask(projectId, task.id, {
        title: values.title !== task.title ? values.title : undefined,
        description:
          values.description !== task.description ? values.description : undefined,
        priority: values.priority !== task.priority ? values.priority : undefined,
        assignedTo:
          values.assignedTo !== task.assignedTo ? values.assignedTo : undefined,
        dueDate: values.dueDate !== dueDate ? values.dueDate : undefined,
      });
    });
    if (done) {
      onSaved();
      onClose();
    }
  }

  return (
    <Modal title={task ? "Edit task" : "New task"} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <FormError message={error?.message} />
        <TextField
          label="Title"
          name="title"
          defaultValue={task?.title}
          maxLength={200}
          data-autofocus
          error={error?.details?.title}
          required
        />
        <TextAreaField
          label="Description"
          name="description"
          rows={3}
          defaultValue={task?.description ?? ""}
          maxLength={5000}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Priority"
            name="priority"
            defaultValue={task?.priority ?? "medium"}
          >
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>
          <TextField
            label="Due date"
            name="dueDate"
            type="date"
            defaultValue={toDateInput(task?.dueDate ?? null)}
            error={error?.details?.dueDate}
          />
        </div>
        <SelectField
          label="Assignee"
          name="assignedTo"
          defaultValue={task?.assignedTo ?? ""}
        >
          <option value="">Unassigned</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </SelectField>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={pending}>
            {task ? "Save changes" : "Create task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

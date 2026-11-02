"use client";

import type { FormEvent } from "react";
import { PROJECT_STATUS_LABELS } from "../../lib/format";
import { useSubmit } from "../../lib/use-submit";
import { createProject, updateProject } from "../../services/project-services";
import type { Project, ProjectStatus } from "../../types";
import { Button } from "../ui/button";
import { FormError, SelectField, TextAreaField, TextField } from "../ui/field";
import { Modal } from "../ui/modal";

export function ProjectFormModal({
  project,
  onClose,
  onSaved,
  onDelete,
}: {
  project?: Project;
  onClose: () => void;
  onSaved: () => void;
  onDelete?: () => void;
}) {
  const { pending, error, run } = useSubmit();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name")).trim();
    const description = String(form.get("description")).trim();
    const done = await run(() =>
      project
        ? updateProject(project.id, {
            name,
            description: description || null,
            status: form.get("status") as ProjectStatus,
          })
        : createProject({ name, description: description || undefined }),
    );
    if (done) {
      onSaved();
      onClose();
    }
  }

  return (
    <Modal title={project ? "Edit project" : "New project"} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <FormError message={error?.message} />
        <TextField
          label="Name"
          name="name"
          defaultValue={project?.name}
          maxLength={100}
          data-autofocus
          error={error?.details?.name}
          required
        />
        <TextAreaField
          label="Description"
          name="description"
          rows={3}
          defaultValue={project?.description ?? ""}
          maxLength={5000}
        />
        {project && (
          <SelectField label="Status" name="status" defaultValue={project.status}>
            {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {onDelete && (
            <Button variant="ghost" className="text-danger" onClick={onDelete}>
              Delete project
            </Button>
          )}
          <span className="ml-auto flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={pending}>
              {project ? "Save changes" : "Create project"}
            </Button>
          </span>
        </div>
      </form>
    </Modal>
  );
}

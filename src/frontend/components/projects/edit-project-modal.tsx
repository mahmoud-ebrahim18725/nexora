"use client";

import { useState } from "react";
import Modal from "@/frontend/components/ui/modal";
import Button from "@/frontend/components/ui/button";
import Field, { FormError, inputClasses } from "@/frontend/components/ui/field";
import { formatLabel } from "@/frontend/lib/format";
import { getErrorMessage } from "@/frontend/lib/use-resource";
import { updateProject } from "@/frontend/services/project-services";
import type {
  ProjectDetails,
  ProjectStatus,
  UpdateProjectInput,
} from "@/frontend/types/project";

const statuses: ProjectStatus[] = [
  "planning",
  "active",
  "completed",
  "archived",
];

export default function EditProjectModal({
  project,
  onClose,
  onSaved,
}: {
  project: ProjectDetails;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [nameError, setNameError] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!name.trim()) {
      setNameError("Project name is required");
      return;
    }
    // The API rejects empty strings, so only send fields that actually changed.
    const changes: UpdateProjectInput = {};
    if (name.trim() !== project.name) changes.name = name.trim();
    if (description.trim() && description.trim() !== project.description) {
      changes.description = description.trim();
    }
    if (status !== project.status) changes.status = status;
    if (Object.keys(changes).length === 0) {
      onClose();
      return;
    }
    setIsLoading(true);
    try {
      await updateProject(project.id, changes);
      onSaved();
      onClose();
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      setIsLoading(false);
    }
  }

  return (
    <Modal
      isOpen
      onClose={() => !isLoading && onClose()}
      title="Project settings"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormError message={error} />
        <Field id="edit-project-name" label="Project name" error={nameError}>
          <input
            id="edit-project-name"
            autoFocus
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setNameError("");
            }}
            aria-invalid={Boolean(nameError)}
            className={`${inputClasses} h-10`}
          />
        </Field>
        <Field id="edit-project-description" label="Description">
          <textarea
            id="edit-project-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className={`${inputClasses} resize-none py-2`}
          />
        </Field>
        <Field id="edit-project-status" label="Status">
          <select
            id="edit-project-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as ProjectStatus)}
            className={`${inputClasses} h-10`}
          >
            {statuses.map((value) => (
              <option key={value} value={value}>
                {formatLabel(value)}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/frontend/components/ui/modal";
import Button from "@/frontend/components/ui/button";
import Field, { FormError, inputClasses } from "@/frontend/components/ui/field";
import { createProject } from "@/frontend/services/project-services";
import { getErrorMessage } from "@/frontend/lib/use-resource";

export default function CreateProjectModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleClose() {
    if (isLoading) return;
    setName("");
    setDescription("");
    setNameError("");
    setError("");
    onClose();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!name.trim()) {
      setNameError("Project name is required");
      return;
    }
    setIsLoading(true);
    try {
      const project = await createProject({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      router.push(`/projects/${project.id}`);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      setIsLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="New project"
      description="You'll be added as the project manager."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormError message={error} />
        <Field id="project-name" label="Project name" error={nameError}>
          <input
            id="project-name"
            autoFocus
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setNameError("");
            }}
            placeholder="e.g. Website redesign"
            aria-invalid={Boolean(nameError)}
            className={`${inputClasses} h-10`}
          />
        </Field>
        <Field id="project-description" label="Description" hint="Optional">
          <textarea
            id="project-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="What is this project about?"
            className={`${inputClasses} resize-none py-2`}
          />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create project
          </Button>
        </div>
      </form>
    </Modal>
  );
}

"use client";

import { useState } from "react";
import Modal from "./modal";
import Button from "./button";
import { FormError } from "./field";
import { getErrorMessage } from "@/frontend/lib/use-resource";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Delete",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleClose() {
    if (isLoading) return;
    setError("");
    onClose();
  }

  async function handleConfirm() {
    setError("");
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="sm">
      <p className="text-sm leading-6 text-gray-600">{description}</p>
      {error && (
        <div className="mt-4">
          <FormError message={error} />
        </div>
      )}
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm} isLoading={isLoading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

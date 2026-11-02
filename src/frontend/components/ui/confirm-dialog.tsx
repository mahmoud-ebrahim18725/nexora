"use client";

import { useSubmit } from "../../lib/use-submit";
import { Button } from "./button";
import { FormError } from "./field";
import { Modal } from "./modal";

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onClose,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => Promise<unknown>;
  onClose: () => void;
}) {
  const { pending, error, run } = useSubmit();

  async function confirm() {
    if (await run(onConfirm)) {
      onClose();
    }
  }

  const details = Object.values(error?.details ?? {}).join(", ");
  const errorMessage = details ? `${error?.message}: ${details}` : error?.message;

  return (
    <Modal title={title} onClose={onClose}>
      <p className="text-muted">{message}</p>
      <FormError message={errorMessage} />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" loading={pending} onClick={confirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

"use client";

import { useState } from "react";
import { toApiError, type ApiError } from "./api-client";

export function useSubmit() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function run(action: () => Promise<unknown>) {
    setPending(true);
    setError(null);
    try {
      await action();
      return true;
    } catch (caught) {
      setError(toApiError(caught));
      return false;
    } finally {
      setPending(false);
    }
  }

  return { pending, error, run };
}

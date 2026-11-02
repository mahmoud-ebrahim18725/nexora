"use client";

import { ErrorState } from "@/frontend/components/ui/states";

export default function Error({ reset }: { reset: () => void }) {
  return <ErrorState message="Something went wrong on this page." onRetry={reset} />;
}

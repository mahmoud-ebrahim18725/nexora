import type { Pagination } from "../../types";
import { Button } from "./button";

export function PaginationControls({
  pagination,
  onChange,
}: {
  pagination: Pagination;
  onChange: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(pagination.total / pagination.limit));
  if (pages <= 1) {
    return null;
  }
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4 text-sm text-muted">
      <span>
        Page <span className="font-mono text-ink">{pagination.page}</span> of{" "}
        <span className="font-mono text-ink">{pages}</span>
      </span>
      <span className="flex gap-2">
        <Button
          variant="secondary"
          disabled={pagination.page <= 1}
          onClick={() => onChange(pagination.page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          disabled={pagination.page >= pages}
          onClick={() => onChange(pagination.page + 1)}
        >
          Next
        </Button>
      </span>
    </nav>
  );
}

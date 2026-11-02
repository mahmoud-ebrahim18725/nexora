import { Button } from "./button";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" aria-label={label} className="flex animate-pulse flex-col gap-4">
      <div className="h-24 rounded-xl bg-column" />
      <div className="h-40 rounded-xl bg-column" />
      <div className="h-40 rounded-xl bg-column" />
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className="flex flex-col items-center gap-4 rounded-xl border border-line bg-white p-10 text-center">
      <p className="text-danger">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-line-strong bg-white p-10 text-center">
      <p className="text-muted">{title}</p>
      {children}
    </div>
  );
}

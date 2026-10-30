import { getErrorMessage } from "@/frontend/lib/use-resource";

export function ErrorState({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 px-5 py-4"
      role="alert"
    >
      <p className="text-sm font-medium text-red-800">
        {getErrorMessage(error)}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded text-sm font-medium text-red-800 underline decoration-red-300 underline-offset-2 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 5v14M5 12h14"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function PageSkeleton({ label }: { label: string }) {
  return (
    <div className="space-y-6" aria-busy="true" aria-label={label}>
      <div className="space-y-2">
        <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded bg-gray-200" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-lg bg-white ring-1 ring-gray-200"
          />
        ))}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}

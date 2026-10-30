import { formatLabel } from "@/frontend/lib/format";

const toneClasses = {
  gray: "bg-gray-100 text-gray-700 ring-gray-200",
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  sky: "bg-sky-50 text-sky-700 ring-sky-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
};

type Tone = keyof typeof toneClasses;

const valueTones: Record<string, Tone> = {
  planning: "violet",
  active: "sky",
  completed: "emerald",
  archived: "gray",
  todo: "gray",
  in_progress: "sky",
  low: "gray",
  medium: "amber",
  high: "red",
  owner: "indigo",
  admin: "violet",
  manager: "indigo",
  member: "gray",
};

export default function Badge({
  value,
  label,
  withDot = false,
}: {
  value: string;
  label?: string;
  withDot?: boolean;
}) {
  const tone = valueTones[value] ?? "gray";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${toneClasses[tone]}`}
    >
      {withDot && (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-current opacity-70"
        />
      )}
      {label ?? formatLabel(value)}
    </span>
  );
}

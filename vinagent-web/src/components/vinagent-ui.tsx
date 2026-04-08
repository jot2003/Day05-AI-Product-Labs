import { cn } from "@/lib/cn";

export type ConfidenceLevel = "high" | "medium" | "low";

export function ConflictBadge({ hasConflict }: { hasConflict: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        hasConflict
          ? "border-accent/30 bg-accent/8 text-accent"
          : "border-success/30 bg-success/8 text-success",
      )}
    >
      <span className={cn("inline-block h-1.5 w-1.5 rounded-full", hasConflict ? "bg-accent" : "bg-success")} />
      {hasConflict ? "Có xung đột" : "Không xung đột"}
    </span>
  );
}

export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const labels = {
    high: "Độ tin cậy cao",
    medium: "Cần xác nhận",
    low: "Độ tin cậy thấp",
  };
  const classes = {
    high: "border-trust-high/30 bg-trust-high/8 text-trust-high",
    medium: "border-trust-mid/30 bg-trust-mid/8 text-trust-mid",
    low: "border-trust-low/30 bg-trust-low/8 text-trust-low",
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", classes[level])}>
      {labels[level]}
    </span>
  );
}

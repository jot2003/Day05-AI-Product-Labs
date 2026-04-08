"use client";

import { cn } from "@/lib/cn";
import type { CourseSlot } from "@/lib/store";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
const DAY_LABELS: Record<string, string> = {
  Mon: "Thứ 2", Tue: "Thứ 3", Wed: "Thứ 4", Thu: "Thứ 5", Fri: "Thứ 6",
};
const START_HOUR = 7;
const END_HOUR = 18;
const TOTAL_ROWS = (END_HOUR - START_HOUR) * 2;

export function VisualCalendar({
  planA,
  planB,
  showPlanB = false,
  selectedPlan,
}: {
  planA: CourseSlot[];
  planB: CourseSlot[];
  showPlanB?: boolean;
  selectedPlan: "A" | "B" | null;
}) {
  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  function getSlotStyle(slot: CourseSlot) {
    const top = ((slot.startHour - START_HOUR) / (END_HOUR - START_HOUR)) * 100;
    const height = ((slot.endHour - slot.startHour) / (END_HOUR - START_HOUR)) * 100;
    return { top: `${top}%`, height: `${height}%` };
  }

  function renderSlots(slots: CourseSlot[], plan: "A" | "B") {
    const isActive = selectedPlan === plan || selectedPlan === null;
    return slots.map((slot, idx) => {
      const dayIdx = DAYS.indexOf(slot.day);
      if (dayIdx < 0) return null;
      const style = getSlotStyle(slot);
      return (
        <div
          key={`${plan}-${slot.code}-${slot.day}-${idx}`}
          className={cn(
            "absolute rounded-lg border px-2 py-1.5 text-[10px] font-medium leading-tight transition-opacity",
            plan === "A"
              ? "bg-primary/15 border-primary/30 text-primary"
              : "bg-accent/15 border-accent/30 text-accent",
            !isActive && "opacity-30",
          )}
          style={{
            ...style,
            left: `${(dayIdx / 5) * 100}%`,
            width: `${100 / 5}%`,
            paddingLeft: "6px",
            paddingRight: "6px",
          }}
          title={`${slot.code} ${slot.name}\n${slot.day} ${slot.startHour}:00–${slot.endHour}:00\n${slot.room ?? ""}`}
        >
          <span className="font-bold">{slot.code}</span>
          <br />
          <span className="opacity-80">{slot.name}</span>
          {slot.room && <><br /><span className="opacity-60">{slot.room}</span></>}
        </div>
      );
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="grid grid-cols-[48px_repeat(5,1fr)] border-b bg-background/60">
        <div className="p-2" />
        {DAYS.map((d) => (
          <div key={d} className="border-l p-2 text-center text-[11px] font-semibold text-muted">
            {DAY_LABELS[d]}
          </div>
        ))}
      </div>
      <div className="relative grid grid-cols-[48px_1fr]" style={{ minHeight: `${TOTAL_ROWS * 20}px` }}>
        <div className="relative">
          {hours.map((h) => (
            <div
              key={h}
              className="absolute right-2 text-[10px] text-muted"
              style={{ top: `${((h - START_HOUR) / (END_HOUR - START_HOUR)) * 100}%`, transform: "translateY(-50%)" }}
            >
              {h}:00
            </div>
          ))}
        </div>
        <div className="relative">
          {hours.map((h) => (
            <div
              key={h}
              className="absolute inset-x-0 border-t border-dashed border-border/50"
              style={{ top: `${((h - START_HOUR) / (END_HOUR - START_HOUR)) * 100}%` }}
            />
          ))}
          {renderSlots(planA, "A")}
          {showPlanB && renderSlots(planB, "B")}
        </div>
      </div>
      <div className="flex items-center gap-4 border-t px-3 py-2 text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded bg-primary/40" />
          <span className="text-muted">Plan A — Tối ưu</span>
        </div>
        {showPlanB && (
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded bg-accent/40" />
            <span className="text-muted">Plan B — Dự phòng</span>
          </div>
        )}
      </div>
    </div>
  );
}

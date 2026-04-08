"use client";

import { cn } from "@/lib/cn";
import { useVinAgent, PLAN_A_COURSES, PLAN_B_COURSES } from "@/lib/store";
import { VisualCalendar } from "./visual-calendar";
import { CitationList } from "./citation-popover";

function ConfidenceBar({ score }: { score: number }) {
  const color = score >= 80 ? "bg-success" : score >= 60 ? "bg-warning" : "bg-danger";
  const label = score >= 80 ? "An toàn" : score >= 60 ? "Cần kiểm tra" : "Rủi ro";
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted">Độ tin cậy</span>
        <span className="text-lg font-bold">{score}<span className="text-xs text-muted font-normal">/100</span></span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-border/40">
        <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${score}%` }} />
      </div>
      <p className="mt-1.5 text-[11px] text-muted">{label}</p>
    </div>
  );
}

function RedFlagBanner({ flags, onAcknowledge }: { flags: string[]; onAcknowledge: () => void }) {
  if (flags.length === 0) return null;
  return (
    <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
      <h4 className="text-xs font-bold text-accent mb-2">Cảnh báo ({flags.length})</h4>
      <ul className="space-y-1.5">
        {flags.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-muted">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {f}
          </li>
        ))}
      </ul>
      <button type="button" onClick={onAcknowledge} className="mt-3 rounded-lg border border-accent/30 px-3 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10">
        Đánh dấu đã xử lý
      </button>
    </div>
  );
}

function PlanListView({ courses, plan }: { courses: typeof PLAN_A_COURSES; plan: "A" | "B" }) {
  return (
    <div className="space-y-2">
      {courses.map((c, idx) => (
        <div key={`${plan}-${c.code}-${c.day}-${idx}`} className="flex items-center gap-3 rounded-xl border bg-white p-3">
          <span className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white",
            plan === "A" ? "bg-primary" : "bg-accent",
          )}>
            {c.code.slice(-3)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold">{c.code} — {c.name}</p>
            <p className="text-[11px] text-muted">{c.day} {c.startHour}:00–{c.endHour > Math.floor(c.endHour) ? `${Math.floor(c.endHour)}:30` : `${c.endHour}:00`} &middot; {c.room}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ResultPanel() {
  const store = useVinAgent();
  const hasResult = store.flow !== "idle";

  if (!hasResult) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center px-8">
        <div className="rounded-2xl border-2 border-dashed border-border/60 p-8">
          <p className="text-sm font-semibold text-muted">Lịch học sẽ hiển thị ở đây</p>
          <p className="mt-1 text-xs text-muted">Nhập yêu cầu ở khung chat bên trái để bắt đầu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/90 backdrop-blur px-4 py-3">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => store.setCurrentView("calendar")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              store.currentView === "calendar" ? "bg-primary/10 text-primary" : "text-muted hover:text-foreground",
            )}
          >
            Lịch học
          </button>
          <button
            type="button"
            onClick={() => store.setCurrentView("list")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              store.currentView === "list" ? "bg-primary/10 text-primary" : "text-muted hover:text-foreground",
            )}
          >
            Danh sách
          </button>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => store.acceptPlan("A")}
            disabled={store.selectedPlan === "A"}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              store.selectedPlan === "A" ? "bg-primary text-white" : "border text-muted hover:border-primary/40 hover:text-primary",
            )}
          >
            Plan A
          </button>
          <button
            type="button"
            onClick={() => store.acceptPlan("B")}
            disabled={store.selectedPlan === "B"}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              store.selectedPlan === "B" ? "bg-accent text-white" : "border text-muted hover:border-accent/40 hover:text-accent",
            )}
          >
            Plan B
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-4">
        {store.currentView === "calendar" ? (
          <VisualCalendar
            planA={PLAN_A_COURSES}
            planB={PLAN_B_COURSES}
            showPlanB={store.usePlanB || store.flow === "failure" || store.flow === "recovery"}
            selectedPlan={store.selectedPlan}
          />
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 text-xs font-semibold text-muted uppercase tracking-wide">Plan A — Tối ưu</h4>
              <PlanListView courses={PLAN_A_COURSES} plan="A" />
            </div>
            {(store.usePlanB || store.flow === "failure" || store.flow === "recovery") && (
              <div>
                <h4 className="mb-2 text-xs font-semibold text-muted uppercase tracking-wide">Plan B — Dự phòng</h4>
                <PlanListView courses={PLAN_B_COURSES} plan="B" />
              </div>
            )}
          </div>
        )}

        <ConfidenceBar score={store.confidenceScore} />

        <RedFlagBanner flags={store.redFlags} onAcknowledge={store.acknowledgeFlags} />

        {store.citations.length > 0 && <CitationList citations={store.citations} />}

        <div className="flex flex-wrap gap-2 pt-2 pb-4">
          {store.selectedPlan && (
            <button type="button" onClick={store.toggleEdit} className="btn-secondary rounded-lg px-3 py-2 text-xs font-semibold">
              Chỉnh sửa kế hoạch
            </button>
          )}
          <button type="button" onClick={store.escalate} className="rounded-lg border border-accent/30 px-3 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent/5">
            Chuyển cố vấn học vụ
          </button>
        </div>

        {store.toast && (
          <div className="rounded-xl border border-success/30 bg-success/5 p-3">
            <p className="text-xs font-bold text-success">{store.toast.title}</p>
            <p className="mt-0.5 text-[11px] text-muted">{store.toast.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

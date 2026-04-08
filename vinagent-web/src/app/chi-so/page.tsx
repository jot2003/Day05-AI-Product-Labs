"use client";

import { cn } from "@/lib/cn";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";

type MetricItem = {
  label: string;
  value: string;
  target: string;
  status: "good" | "warning" | "danger";
};

const METRICS: MetricItem[] = [
  { label: "Độ chính xác xếp lịch", value: "89%", target: "> 85%", status: "good" },
  { label: "Tỷ lệ chỉnh sửa thủ công", value: "22%", target: "< 25%", status: "good" },
  { label: "Tỷ lệ kích hoạt Plan B", value: "17%", target: "< 15%", status: "warning" },
  { label: "Số cờ đỏ đang mở", value: "1", target: "0", status: "warning" },
  { label: "Thời gian đăng ký trung bình", value: "6 phút", target: "< 8 phút", status: "good" },
  { label: "Tín hiệu do dự thu thập", value: "127", target: "> 500/kỳ", status: "danger" },
];

const statusColors = {
  good: "border-success/30 bg-success/5 text-success",
  warning: "border-warning/30 bg-warning/5 text-warning",
  danger: "border-accent/30 bg-accent/5 text-accent",
};

const statusLabels = { good: "Đạt", warning: "Theo dõi", danger: "Cờ đỏ" };

export default function MetricsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">
      <FadeIn>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Bảng chỉ số vận hành</h1>
          <p className="mt-1 text-sm text-muted">Theo dõi sức khỏe hệ thống theo ngưỡng triển khai.</p>
        </header>
      </FadeIn>

      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {METRICS.map((m) => (
          <StaggerItem key={m.label}>
            <article className="rounded-xl border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-xs font-medium text-muted">{m.label}</p>
              <p className="mt-2 text-2xl font-bold tracking-tight">{m.value}</p>
              <p className="mt-1 text-[11px] text-muted">Mục tiêu: {m.target}</p>
              <span className={cn("mt-3 inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold", statusColors[m.status])}>
                {statusLabels[m.status]}
              </span>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

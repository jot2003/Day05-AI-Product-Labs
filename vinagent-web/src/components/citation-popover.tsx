"use client";

import { useState } from "react";
import type { Citation } from "@/lib/citations";
import { getCitationLabel, getCitationColor } from "@/lib/citations";
import { cn } from "@/lib/cn";

export function CitationRef({
  id,
  citation,
}: {
  id: number;
  citation?: Citation;
}) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex h-4 min-w-4 items-center justify-center rounded bg-primary/15 px-1 text-[10px] font-bold text-primary transition-colors hover:bg-primary/25 align-super"
      >
        {id}
      </button>
      {open && citation && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 w-72 -translate-x-1/2 rounded-xl border bg-white p-3 shadow-lg">
          <div className="mb-2 flex items-center gap-2">
            <span className={cn("rounded-md border px-2 py-0.5 text-[10px] font-semibold", getCitationColor(citation.type))}>
              {getCitationLabel(citation.type)}
            </span>
            <span className="text-[10px] text-muted">{citation.timestamp}</span>
          </div>
          <p className="text-xs font-semibold">{citation.title}</p>
          <p className="mt-1 text-xs text-muted leading-relaxed">{citation.detail}</p>
        </div>
      )}
    </span>
  );
}

export function CitationList({ citations }: { citations: Citation[] }) {
  if (citations.length === 0) return null;
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-muted uppercase tracking-wide">Nguồn tham khảo</h4>
      {citations.map((c) => (
        <div key={c.id} className="flex items-start gap-2 rounded-lg border bg-background p-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/15 text-[10px] font-bold text-primary">
            {c.id}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={cn("rounded border px-1.5 py-0.5 text-[9px] font-semibold", getCitationColor(c.type))}>
                {getCitationLabel(c.type)}
              </span>
              <span className="text-[10px] text-muted">{c.timestamp}</span>
            </div>
            <p className="mt-1 text-xs font-medium">{c.title}</p>
            <p className="mt-0.5 text-[11px] text-muted leading-relaxed">{c.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

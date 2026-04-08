"use client";

import { ChatPanel } from "@/components/chat-panel";
import { ResultPanel } from "@/components/result-panel";

export default function CreatePlanPage() {
  return (
    <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 53px)" }}>
      <div className="flex w-full flex-col border-r bg-white/60 md:w-[42%] lg:w-[38%]">
        <ChatPanel />
      </div>
      <div className="hidden flex-1 bg-background md:flex md:flex-col">
        <ResultPanel />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { useVinAgent, type ChatMessage } from "@/lib/store";
import { TypingText } from "./typing-text";
import { CitationRef } from "./citation-popover";

const SUGGESTIONS = [
  "Lên lịch HK Xuân 2026, tránh sáng, phải có Giải tích 2",
  "Đăng ký 4 môn, ưu tiên cùng nhóm bạn",
  "Xếp lịch không xung đột, ưu tiên chiều",
];

function MessageBubble({ message, isLatest }: { message: ChatMessage; isLatest: boolean }) {
  const { citations } = useVinAgent();
  const isUser = message.role === "user";

  function renderTextWithCitations(text: string) {
    const parts = text.split(/\[(\d+(?:,\d+)*)\]/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        const ids = part.split(",").map(Number);
        return ids.map((id) => {
          const cit = citations.find((c) => c.id === id);
          return <CitationRef key={`${message.id}-cit-${id}`} id={id} citation={cit} />;
        });
      }
      return <span key={`${message.id}-text-${i}`}>{part}</span>;
    });
  }

  return (
    <div className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}>
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-[10px] font-bold text-white">
          VA
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line",
          isUser
            ? "bg-primary text-white rounded-tr-md"
            : "bg-background border rounded-tl-md",
        )}
      >
        {!isUser && isLatest ? (
          <TypingText text={message.text} speed={12} />
        ) : (
          renderTextWithCitations(message.text)
        )}
      </div>
    </div>
  );
}

export function ChatPanel() {
  const { messages, prompt, setPrompt, generate, isTyping, flow, clarify } = useVinAgent();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && typeof el.scrollTo === "function") {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages.length, isTyping]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isEmpty && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-white mb-4">
              VA
            </div>
            <h3 className="text-base font-semibold">Xin chào! Mình là VinAgent</h3>
            <p className="mt-1 max-w-xs text-sm text-muted">
              Mô tả yêu cầu đăng ký học phần bằng ngôn ngữ tự nhiên, mình sẽ tạo kế hoạch tối ưu cho bạn.
            </p>
            <div className="mt-6 flex flex-col gap-2 w-full max-w-xs">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setPrompt(s); generate(s); }}
                  className="rounded-xl border bg-white px-4 py-2.5 text-left text-xs text-muted transition-all hover:border-primary/40 hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <MessageBubble key={msg.id} message={msg} isLatest={idx === messages.length - 1 && msg.role === "assistant"} />
        ))}

        {isTyping && (
          <div className="flex gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-[10px] font-bold text-white">
              VA
            </div>
            <div className="rounded-2xl rounded-tl-md border bg-background px-4 py-3">
              <span className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>
        )}

        {(flow === "lowConfidence" || flow === "idle") && messages.length > 0 && !isTyping && (
          <div className="flex gap-2 pl-9">
            <button
              type="button"
              onClick={() => clarify("avoidMorning")}
              className="rounded-xl border bg-white px-3 py-2 text-xs font-medium transition-all hover:border-primary/40 hover:text-primary"
            >
              Tránh lịch sáng
            </button>
            <button
              type="button"
              onClick={() => clarify("keepGroup")}
              className="rounded-xl border bg-white px-3 py-2 text-xs font-medium transition-all hover:border-primary/40 hover:text-primary"
            >
              Giữ lớp cùng nhóm
            </button>
          </div>
        )}
      </div>

      <form
        className="border-t bg-white px-4 py-3"
        onSubmit={(e) => { e.preventDefault(); if (prompt.trim()) generate(prompt.trim()); }}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Nhập yêu cầu đăng ký học phần..."
            disabled={isTyping}
            className="flex-1 rounded-xl border bg-background px-4 py-2.5 text-sm transition-all placeholder:text-muted focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isTyping}
            className="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-50 disabled:transform-none"
          >
            Gửi
          </button>
        </div>
      </form>
    </div>
  );
}

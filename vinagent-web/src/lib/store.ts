import { create } from "zustand";

import type { Citation } from "./citations";
import { evaluatePlannerDecision, type PlannerDecision, type ReasonWithCitation } from "./planner";

export type FlowState = "idle" | "happy" | "lowConfidence" | "failure" | "recovery" | "escalated";
export type ConfidenceLevel = "high" | "medium" | "low";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  citationIds?: number[];
  timestamp: Date;
};

export type CourseSlot = {
  code: string;
  name: string;
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
  startHour: number;
  endHour: number;
  room?: string;
};

interface VinAgentState {
  prompt: string;
  flow: FlowState;
  selectedPlan: "A" | "B" | null;
  usePlanB: boolean;
  isEdited: boolean;
  confidenceScore: number;
  autoActionEnabled: boolean;
  redFlags: string[];
  reasons: ReasonWithCitation[];
  citations: Citation[];
  toast: { title: string; message: string } | null;
  lastDecision: PlannerDecision | null;
  messages: ChatMessage[];
  currentView: "calendar" | "list";
  isTyping: boolean;

  setPrompt: (prompt: string) => void;
  setToast: (toast: { title: string; message: string } | null) => void;
  setCurrentView: (view: "calendar" | "list") => void;
  generate: (inputPrompt: string) => void;
  acceptPlan: (plan: "A" | "B") => void;
  toggleEdit: () => void;
  escalate: () => void;
  acknowledgeFlags: () => void;
  toggleAutoAction: () => void;
  clarify: (choice: "avoidMorning" | "keepGroup") => void;
  confidenceLevel: () => ConfidenceLevel;
}

let msgCounter = 0;
function makeId() {
  return `msg-${++msgCounter}-${Date.now()}`;
}

export const PLAN_A_COURSES: CourseSlot[] = [
  { code: "CECS101", name: "Giải tích 2", day: "Mon", startHour: 9, endHour: 10.5, room: "P.301" },
  { code: "CECS101", name: "Giải tích 2", day: "Wed", startHour: 9, endHour: 10.5, room: "P.301" },
  { code: "CECS203", name: "Cấu trúc dữ liệu", day: "Tue", startHour: 13, endHour: 14.5, room: "P.205" },
  { code: "CECS204", name: "Thực hành OOP", day: "Thu", startHour: 15, endHour: 17, room: "Lab A" },
];

export const PLAN_B_COURSES: CourseSlot[] = [
  { code: "CECS101", name: "Giải tích 2", day: "Mon", startHour: 14, endHour: 15.5, room: "P.302" },
  { code: "CECS101", name: "Giải tích 2", day: "Wed", startHour: 14, endHour: 15.5, room: "P.302" },
  { code: "CECS203", name: "Cấu trúc dữ liệu", day: "Tue", startHour: 15, endHour: 16.5, room: "P.206" },
  { code: "CECS204", name: "Thực hành OOP", day: "Fri", startHour: 9, endHour: 11, room: "Lab B" },
];

export const useVinAgent = create<VinAgentState>((set, get) => ({
  prompt: "",
  flow: "idle",
  selectedPlan: null,
  usePlanB: false,
  isEdited: false,
  confidenceScore: 100,
  autoActionEnabled: false,
  redFlags: [],
  reasons: [],
  citations: [],
  toast: null,
  lastDecision: null,
  messages: [],
  currentView: "calendar",
  isTyping: false,

  setPrompt: (prompt) => set({ prompt }),
  setToast: (toast) => set({ toast }),
  setCurrentView: (view) => set({ currentView: view }),

  generate: (inputPrompt) => {
    const userMsg: ChatMessage = { id: makeId(), role: "user", text: inputPrompt, timestamp: new Date() };
    set((s) => ({ messages: [...s.messages, userMsg], isTyping: true }));

    const decision = evaluatePlannerDecision(inputPrompt);
    const flags: string[] = [];
    if (!decision.toolSnapshot.dataFresh) flags.push("Dữ liệu SIS đã cũ (vượt quá 5 phút), cần làm mới.");
    if (decision.confidenceScore < 70) flags.push("Độ tin cậy dưới 70, chưa đủ điều kiện tự động hành động.");
    if (decision.toolSnapshot.seatRisk === "high") flags.push("Rủi ro hết chỗ cao, ưu tiên Plan B.");

    let assistantText: string;
    let flow: FlowState;

    if (decision.flow === "failure") {
      flow = "failure";
      assistantText = `Đã phân tích yêu cầu của bạn. Phát hiện một số rủi ro cần lưu ý:\n\n` +
        decision.reasons.map((r) => `• ${r.text} [${r.citationIds.join(",")}]`).join("\n") +
        `\n\nĐiểm tin cậy: ${decision.confidenceScore}/100. Plan B đã sẵn sàng để chuyển đổi.`;
    } else if (decision.flow === "lowConfidence") {
      flow = "lowConfidence";
      assistantText = `Đã nhận yêu cầu, nhưng cần làm rõ thêm:\n\n` +
        decision.reasons.map((r) => `• ${r.text} [${r.citationIds.join(",")}]`).join("\n") +
        `\n\nVui lòng bổ sung thông tin để hệ thống tạo kế hoạch chính xác hơn.`;
    } else {
      flow = "happy";
      assistantText = `Đã tạo kế hoạch đăng ký học phần thành công!\n\n` +
        decision.reasons.map((r) => `• ${r.text} [${r.citationIds.join(",")}]`).join("\n") +
        `\n\nĐiểm tin cậy: ${decision.confidenceScore}/100. Bạn có thể xem lịch học bên phải và xác nhận phương án.`;
    }

    const allCitIds = decision.citations.map((c) => c.id);
    const assistantMsg: ChatMessage = { id: makeId(), role: "assistant", text: assistantText, citationIds: allCitIds, timestamp: new Date() };

    setTimeout(() => {
      set({
        messages: [...get().messages, assistantMsg],
        isTyping: false,
        flow,
        confidenceScore: decision.confidenceScore,
        redFlags: flags,
        reasons: decision.reasons,
        citations: decision.citations,
        lastDecision: decision,
        usePlanB: decision.needsPlanBFallback,
        autoActionEnabled: false,
        toast: null,
      });
    }, 600);
  },

  acceptPlan: (plan) => {
    const { flow, messages } = get();
    if (flow === "failure" && plan === "A") {
      const msg: ChatMessage = { id: makeId(), role: "assistant", text: "Plan A có rủi ro cao, hệ thống đã tự động chuyển sang Plan B để đảm bảo an toàn.", timestamp: new Date() };
      set({
        messages: [...messages, msg],
        selectedPlan: "B",
        usePlanB: true,
        flow: "recovery",
        toast: { title: "Đã kích hoạt Plan B", message: "Plan A thất bại, hệ thống chuyển sang Plan B." },
      });
      return;
    }
    const msg: ChatMessage = { id: makeId(), role: "assistant", text: `Đã xác nhận Plan ${plan}. Bạn có thể tiến hành đăng ký.`, timestamp: new Date() };
    set({
      messages: [...messages, msg],
      selectedPlan: plan,
      flow: "happy",
      toast: { title: "Sẵn sàng đăng ký", message: `Bạn đã chọn Plan ${plan}.` },
    });
  },

  toggleEdit: () => set((s) => ({
    isEdited: !s.isEdited,
    toast: { title: "Đã cập nhật", message: "Đã chỉnh sửa kế hoạch." },
  })),

  escalate: () => {
    const msg: ChatMessage = { id: makeId(), role: "assistant", text: "Đã tạo bản tóm tắt (Advisor Brief) và chuyển cho cố vấn học vụ. Cố vấn sẽ liên hệ bạn trong vòng 24 giờ.", timestamp: new Date() };
    set((s) => ({
      messages: [...s.messages, msg],
      flow: "escalated",
      toast: { title: "Đã chuyển cố vấn học vụ", message: "Advisor Brief đã tạo kèm bối cảnh phiên." },
    }));
  },

  acknowledgeFlags: () => set({
    redFlags: [],
    confidenceScore: 88,
    toast: { title: "Đã xử lý cảnh báo", message: "Cờ đỏ đã xóa, độ tin cậy đã cập nhật." },
  }),

  toggleAutoAction: () => {
    const { autoActionEnabled, confidenceScore, redFlags } = get();
    const next = !autoActionEnabled;
    if (next && (confidenceScore < 80 || redFlags.length > 0)) {
      set({ toast: { title: "Chặn tự động hành động", message: "Chưa đủ điều kiện an toàn." } });
      return;
    }
    set({
      autoActionEnabled: next,
      toast: { title: "Đã cập nhật", message: next ? "Đã bật tự động hành động." : "Đã tắt tự động hành động." },
    });
  },

  clarify: (choice) => {
    const text = choice === "avoidMorning" ? "Đã ghi nhận: ưu tiên các lớp sau 9 giờ sáng." : "Đã ghi nhận: ưu tiên giữ lịch học cùng nhóm bạn.";
    const msg: ChatMessage = { id: makeId(), role: "assistant", text, timestamp: new Date() };
    set((s) => ({
      messages: [...s.messages, msg],
      flow: "happy",
      toast: { title: "Đã ghi nhận ưu tiên", message: text },
    }));
  },

  confidenceLevel: () => {
    const { flow } = get();
    if (flow === "lowConfidence") return "low";
    if (flow === "failure") return "medium";
    return "high";
  },
}));

import type { Citation } from "./citations";

export type PlannerFlow = "happy" | "lowConfidence" | "failure";

export type ToolSnapshot = {
  prerequisitesOk: boolean;
  seatRisk: "low" | "medium" | "high";
  dataFresh: boolean;
  sourceTimestamp: string;
};

export type ReasonWithCitation = {
  text: string;
  citationIds: number[];
};

export type PlannerDecision = {
  flow: PlannerFlow;
  confidenceScore: number;
  reasons: ReasonWithCitation[];
  needsPlanBFallback: boolean;
  toolSnapshot: ToolSnapshot;
  citations: Citation[];
};

function normalizePrompt(prompt: string) {
  return prompt.trim().toLowerCase();
}

function runMockTools(prompt: string): ToolSnapshot {
  const normalized = normalizePrompt(prompt);
  const prerequisitesOk = !normalized.includes("missing prereq");
  const staleDataSignal =
    normalized.includes("stale") || normalized.includes("high risk");
  const seatRisk: ToolSnapshot["seatRisk"] = normalized.includes("near full")
    ? "high"
    : normalized.includes("waitlist")
      ? "medium"
      : staleDataSignal
        ? "high"
        : "low";

  return {
    prerequisitesOk,
    seatRisk,
    dataFresh: !staleDataSignal,
    sourceTimestamp: "10:32 08/04/2026",
  };
}

export function evaluatePlannerDecision(prompt: string): PlannerDecision {
  const normalized = normalizePrompt(prompt);
  const toolSnapshot = runMockTools(normalized);
  const reasons: ReasonWithCitation[] = [];
  const citations: Citation[] = [];
  let citationCounter = 1;

  function addCitation(type: Citation["type"], title: string, detail: string): number {
    const id = citationCounter++;
    citations.push({ id, type, title, detail, timestamp: toolSnapshot.sourceTimestamp });
    return id;
  }

  let score = 100;

  if (!normalized) {
    score -= 45;
    const cid = addCitation("regulation", "Hệ thống phân tích yêu cầu", "Không phát hiện ràng buộc hoặc môn học cụ thể trong yêu cầu.");
    reasons.push({ text: "Chưa nhập yêu cầu cụ thể về học kỳ.", citationIds: [cid] });
  }

  if (
    normalized.includes("khong chac") ||
    normalized.includes("khong ro") ||
    normalized.includes("help")
  ) {
    score -= 30;
    const cid = addCitation("regulation", "Bộ phân tích ý định", "Ý định người dùng không đủ rõ ràng để tự động tạo kế hoạch.");
    reasons.push({ text: "Ý định chưa rõ ràng, cần làm rõ trước khi tạo kế hoạch.", citationIds: [cid] });
  }

  if (!toolSnapshot.prerequisitesOk) {
    score -= 25;
    const cid = addCitation("prerequisite", "Kiểm tra điều kiện tiên quyết", "Phát hiện nguy cơ không đủ điều kiện tiên quyết cho một số môn.");
    reasons.push({ text: "Phát hiện nguy cơ không đủ điều kiện tiên quyết.", citationIds: [cid] });
  }

  if (toolSnapshot.seatRisk === "medium") {
    score -= 10;
    const cid = addCitation("sis", "Dữ liệu SIS — tình trạng chỗ ngồi", "Một số lớp có tỷ lệ đăng ký 70-85%, nên giữ phương án dự phòng.");
    reasons.push({ text: "Rủi ro hết chỗ ở mức trung bình, nên giữ phương án dự phòng.", citationIds: [cid] });
  }

  if (toolSnapshot.seatRisk === "high") {
    score -= 20;
    const cid = addCitation("sis", "Dữ liệu SIS — tình trạng chỗ ngồi", "Lớp CECS101 còn 3/40 chỗ, CECS203 còn 5/35 chỗ. Rủi ro hết chỗ rất cao.");
    reasons.push({ text: "Rủi ro hết chỗ cao, cần Plan B để chuyển đổi kịp thời.", citationIds: [cid] });
  }

  if (!toolSnapshot.dataFresh) {
    score -= 25;
    const cid = addCitation("sis", "Kiểm tra độ mới dữ liệu", `Dữ liệu SIS được cập nhật lần cuối lúc ${toolSnapshot.sourceTimestamp}. TTL đã vượt ngưỡng 5 phút.`);
    reasons.push({ text: "Dữ liệu đã cũ, nguy cơ đăng ký thất bại tăng cao.", citationIds: [cid] });
  }

  const confidenceScore = Math.max(0, Math.min(100, score));
  const needsPlanBFallback =
    toolSnapshot.seatRisk === "high" || !toolSnapshot.dataFresh;

  if (!toolSnapshot.dataFresh || confidenceScore < 45) {
    return { flow: "failure", confidenceScore, reasons, needsPlanBFallback, toolSnapshot, citations };
  }

  if (confidenceScore < 80) {
    return { flow: "lowConfidence", confidenceScore, reasons, needsPlanBFallback, toolSnapshot, citations };
  }

  const happyCid1 = addCitation("sis", "Dữ liệu SIS — xác nhận lịch", "Tất cả các lớp đã kiểm tra đều còn chỗ và không xung đột thời gian.");
  const happyCid2 = addCitation("prerequisite", "Kiểm tra điều kiện tiên quyết", "Tất cả điều kiện tiên quyết đã được đáp ứng.");
  reasons.push({ text: "Độ tin cậy đạt ngưỡng, có thể tiếp tục bình thường.", citationIds: [happyCid1, happyCid2] });
  return { flow: "happy", confidenceScore, reasons, needsPlanBFallback, toolSnapshot, citations };
}

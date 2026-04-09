# BKAgent Filled Submission (Lab 6)

Tài liệu này là bản điền đầy đủ theo template cho dự án BKAgent.

## 1) AI Product Canvas

|   | Value | Trust | Feasibility |
|---|-------|-------|-------------|
| Trả lời | User chính: sinh viên HUST năm 1-2. Pain: khó lập lịch tín chỉ do trùng lịch, thiếu tiên quyết, và hết chỗ ở môn đại cương. AI giải: chat tiếng Việt -> gọi tools học vụ -> tạo Plan A/B có thể thao tác nhanh. | Khi AI sai: user thấy mismatch với ràng buộc/slot. Cách sửa: edit plan, confirm bắt buộc, citation để đối chiếu, fallback Plan B. | Cost model thấp (Gemini Flash), latency mục tiêu < 3s. Risk chính: stale slot data, hallucination mã môn, thiếu dữ liệu lớp cho một số học phần. |

Automation hay augmentation: mô hình lai, nhưng ưu tiên augmentation (người dùng quyết định cuối).

Learning signal:
- correction theo session (đổi môn, đổi giờ, rollback),
- implicit chọn Plan A/B + explicit rating,
- hesitation signal + tỷ lệ fallback.

## 2) User Stories 4 paths

### Feature: Lập kế hoạch đăng ký (Plan A/B)
- Happy: trả 2 plan không trùng lịch, còn chỗ, user chọn nhanh.
- Low-confidence: thiếu điều kiện -> hỏi lại trước khi xếp lịch.
- Failure: không khả thi -> nêu lý do + đề xuất fallback.
- Correction: user sửa ràng buộc -> re-generate và ghi correction.

### Feature: Group invite một chiều
- Happy: user đã đăng ký -> gửi mời -> bạn xác nhận -> nạp plan.
- Low-confidence: slot nhóm không ổn định -> yêu cầu xác nhận ưu tiên.
- Failure: không có slot chung -> đề xuất gần nhất + tách nhóm.
- Correction: từ chối mời/đổi plan -> cập nhật trạng thái mời.

## 3) Eval metrics + threshold

- Schedule precision > 85% (red flag < 70%/24h)
- Manual edit rate < 25% (red flag > 40%)
- Time-to-register-ready < 10 phút (red flag > 30 phút)
- Plan B activation < 20% session (red flag > 40%)

## 4) Top failure modes

1. Hallucination tiên quyết -> bắt buộc check_prerequisites.
2. Slot data stale -> timestamp + TTL ngắn + Plan B.
3. LT-BT-TN mismatch -> ràng buộc cứng trong scheduler.

## 5) ROI 3 scenarios

- Conservative: 10% adoption -> ~28k giờ tiết kiệm/năm.
- Realistic: 30% adoption -> ~75.6k giờ tiết kiệm/năm.
- Optimistic: 60% adoption -> ~151.2k giờ tiết kiệm/năm.

Kill criteria: precision < 70% liên tục 24h hoặc edit rate > 40% kéo dài.

## 6) Mini AI Spec

BKAgent là AI copilot cho đăng ký tín chỉ HUST. Hệ thống không giải bài toán hạ tầng SIS, mà tối ưu lập kế hoạch đăng ký khả thi bằng cách kết hợp LLM + tool-call + rule ràng buộc. Đầu ra gồm Plan A/B, citation, cảnh báo rủi ro, và fallback rõ ràng.

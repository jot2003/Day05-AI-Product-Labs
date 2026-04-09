# BKAgent Tools Guide (Project-specific)

Hướng dẫn nhanh bộ tools đang dùng trong dự án BKAgent.

## Tool stack trong app

- `get_student_profile`: lấy profile sinh viên hiện tại.
- `get_recommended_courses`: đề xuất môn theo CTĐT + học kỳ hiện tại.
- `search_courses`: tìm mã môn/tên môn.
- `check_schedule`: kiểm lịch lớp + số chỗ + seatRisk.
- `check_prerequisites`: kiểm tra điều kiện tiên quyết.
- `generate_schedule`: tạo Plan A/B theo ràng buộc.

## Prompt design cho BKAgent

Cần luôn có:
1. Vai trò rõ ràng (cố vấn học vụ HUST).
2. Quy trình gọi tool bắt buộc.
3. Cam đoan "không bịa dữ liệu".
4. Output format có citation + suggestions.

## Rule nghiep vu can giu

- Ràng buộc lịch là deterministic (không giao hết cho LLM).
- Có fallback Plan B cho trường hợp rủi ro.
- Human-in-the-loop trước action quan trọng.
- Tách session theo user đăng nhập.

## Checklist debug nhanh

- Nếu không tạo được Plan A/B: check `schedule.json` có đủ mã môn chưa.
- Nếu citation lỗi: check mapping citation id trong output tool.
- Nếu thông báo mời nhóm không cập nhật: check local event + storage event.
- Nếu "tránh sáng" vẫn ra 10h: check định nghĩa rule `avoid_morning`.

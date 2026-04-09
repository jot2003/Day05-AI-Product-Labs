# BKAgent Reference Snapshot

Tổng hợp nhanh tình trạng dự án để đối chiếu khi làm SPEC/Prototype/Demo.

## Product scope

- Domain: HUST course registration planning.
- In scope: phân tích yêu cầu, kiểm tiên quyết, check lịch/slot, tạo Plan A/B.
- Out of scope: xử lý hạ tầng dk-sis (timeout/latency hệ thống trường).

## Architecture

- Frontend/Backend: Next.js
- State: Zustand persist
- AI runtime: LangGraph + LangChain + Gemini
- Data: mock JSON (`student`, `courses`, `schedule`, `prerequisites`, `curriculum`)

## Demo-critical features

1. Plan A/B + confidence per plan
2. Citation + nguồn dữ liệu
3. Group invite một chiều
4. Session theo user
5. Follow-up suggestions sau mỗi câu trả lời

## Current known limits

- Dữ liệu là mock, chưa đồng bộ SIS production.
- Chất lượng plan phụ thuộc độ đầy đủ của `schedule.json`.
- Cần feedback form đầy đủ theo zone để tránh trừ điểm cá nhân.

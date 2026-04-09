# BKAgent Reference Snapshot

Tong hop nhanh tinh trang du an de doi chieu khi lam SPEC/Prototype/Demo.

## Product scope

- Domain: HUST course registration planning.
- In scope: phan tich yeu cau, kiem tien quyet, check lich/slot, tao Plan A/B.
- Out of scope: xu ly ha tang dk-sis (timeout/latency he thong truong).

## Architecture

- Frontend/Backend: Next.js
- State: Zustand persist
- AI runtime: LangGraph + LangChain + Gemini
- Data: mock JSON (`student`, `courses`, `schedule`, `prerequisites`, `curriculum`)

## Demo-critical features

1. Plan A/B + confidence per plan
2. Citation + nguon du lieu
3. Group invite mot chieu
4. Session theo user
5. Follow-up suggestions sau moi cau tra loi

## Current known limits

- Du lieu la mock, chua dong bo SIS production.
- Chat luong plan phu thuoc do day du cua `schedule.json`.
- Can feedback form day du theo zone de tranh tru diem ca nhan.

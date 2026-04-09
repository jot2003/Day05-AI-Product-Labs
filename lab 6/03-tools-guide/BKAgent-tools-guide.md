# BKAgent Tools Guide (Project-specific)

Huong dan nhanh bo tools dang dung trong du an BKAgent.

## Tool stack trong app

- `get_student_profile`: lay profile sinh vien hien tai.
- `get_recommended_courses`: de xuat mon theo CTDT + hoc ky hien tai.
- `search_courses`: tim ma mon/ten mon.
- `check_schedule`: kiem lich lop + so cho + seatRisk.
- `check_prerequisites`: kiem tra dieu kien tien quyet.
- `generate_schedule`: tao Plan A/B theo rang buoc.

## Prompt design cho BKAgent

Can luon co:
1. Vai tro ro rang (co van hoc vu HUST).
2. Quy trinh goi tool bat buoc.
3. Cam doan "khong bia du lieu".
4. Output format co citation + suggestions.

## Rule nghiep vu can giu

- Rang buoc lich la deterministic (khong giao het cho LLM).
- Co fallback Plan B cho truong hop rui ro.
- Human-in-the-loop truoc action quan trong.
- Tach session theo user dang nhap.

## Checklist debug nhanh

- Neu khong tao duoc Plan A/B: check `schedule.json` co du ma mon chua.
- Neu citation loi: check mapping citation id trong output tool.
- Neu thong bao moi nhom khong cap nhat: check local event + storage event.
- Neu "tranh sang" van ra 10h: check dinh nghia rule `avoid_morning`.

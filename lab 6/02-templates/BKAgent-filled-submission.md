# BKAgent Filled Submission (Lab 6)

Tai lieu nay la ban dien day du theo template cho du an BKAgent.

## 1) AI Product Canvas

|   | Value | Trust | Feasibility |
|---|-------|-------|-------------|
| Tra loi | User chinh: sinh vien HUST nam 1-2. Pain: kho lap lich tin chi do trung lich, thieu tien quyet, va het cho o mon dai cuong. AI giai: chat tieng Viet -> goi tools hoc vu -> tao Plan A/B co the thao tac nhanh. | Khi AI sai: user thay mismatch voi rang buoc/slot. Cach sua: edit plan, confirm bat buoc, citation de doi chieu, fallback Plan B. | Cost model thap (Gemini Flash), latency muc tieu < 3s. Risk chinh: stale slot data, hallucination ma mon, thieu du lieu lop cho mot so hoc phan. |

Automation hay augmentation: mo hinh lai, nhung uu tien augmentation (nguoi dung quyet dinh cuoi).

Learning signal:
- correction theo session (doi mon, doi gio, rollback),
- implicit chon Plan A/B + explicit rating,
- hesitation signal + ty le fallback.

## 2) User Stories 4 paths

### Feature: Lap ke hoach dang ky (Plan A/B)
- Happy: tra 2 plan khong trung lich, con cho, user chon nhanh.
- Low-confidence: thieu dieu kien -> hoi lai truoc khi xep lich.
- Failure: khong kha thi -> neu ly do + de xuat fallback.
- Correction: user sua rang buoc -> re-generate va ghi correction.

### Feature: Group invite mot chieu
- Happy: user da dang ky -> gui moi -> ban xac nhan -> nap plan.
- Low-confidence: slot nhom khong on dinh -> yeu cau xac nhan uu tien.
- Failure: khong co slot chung -> de xuat gan nhat + tach nhom.
- Correction: tu choi moi/doi plan -> cap nhat trang thai moi.

## 3) Eval metrics + threshold

- Schedule precision > 85% (red flag < 70%/24h)
- Manual edit rate < 25% (red flag > 40%)
- Time-to-register-ready < 10 phut (red flag > 30 phut)
- Plan B activation < 20% session (red flag > 40%)

## 4) Top failure modes

1. Hallucination tien quyet -> bat buoc check_prerequisites.
2. Slot data stale -> timestamp + TTL ngan + Plan B.
3. LT-BT-TN mismatch -> rang buoc cung trong scheduler.

## 5) ROI 3 scenarios

- Conservative: 10% adoption -> ~28k gio tiet kiem/nam.
- Realistic: 30% adoption -> ~75.6k gio tiet kiem/nam.
- Optimistic: 60% adoption -> ~151.2k gio tiet kiem/nam.

Kill criteria: precision < 70% lien tuc 24h hoac edit rate > 40% keo dai.

## 6) Mini AI Spec

BKAgent la AI copilot cho dang ky tin chi HUST. He thong khong giai bai toan ha tang SIS, ma toi uu lap ke hoach dang ky kha thi bang cach ket hop LLM + tool-call + rule rang buoc. Dau ra gom Plan A/B, citation, canh bao rui ro, va fallback ro rang.

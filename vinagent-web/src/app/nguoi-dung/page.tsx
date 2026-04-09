"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, User, LogOut } from "lucide-react";

import { getCurrentStudent, logoutAccount, verifyCurrentStudent } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserProfilePage() {
  const router = useRouter();
  const [verification, setVerification] = useState<{ ok: boolean; message: string } | null>(null);
  const student = useSyncExternalStore(
    () => () => {},
    () => getCurrentStudent(),
    () => null,
  );

  function onVerify() {
    setVerification(verifyCurrentStudent());
  }

  function onLogout() {
    logoutAccount();
    router.push("/dang-nhap");
  }

  if (!student) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col justify-center px-4 py-8">
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle>Chưa đăng nhập</CardTitle>
            <CardDescription>
              Vui lòng đăng nhập để truy cập trang Người dùng.
              Nếu chưa có tài khoản, bạn cần đăng ký trước.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild>
              <Link href="/dang-nhap">Đăng nhập</Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              Chưa có tài khoản? <Link href="/dang-ky" className="text-primary underline">Đăng ký</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8">
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-4" />
            Hồ sơ người dùng
          </CardTitle>
          <CardDescription>
            Thông tin lấy từ dữ liệu đã đăng nhập và đối chiếu với file student.json.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <InfoRow label="Mã sinh viên" value={student.id} />
            <InfoRow label="Họ tên" value={student.name} />
            <InfoRow label="Ngành" value={student.major} />
            <InfoRow label="Năm học" value={String(student.year)} />
            <InfoRow label="GPA" value={String(student.gpa)} />
            <InfoRow label="Học kỳ hiện tại" value={student.currentSemester} />
            <InfoRow label="Cố vấn" value={student.advisorName} />
            <InfoRow label="Số môn mục tiêu" value={String(student.targetCourses.length)} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={onVerify} className="gap-1.5">
              <ShieldCheck className="size-4" />
              Kiểm tra dữ liệu
            </Button>
            <Button onClick={onLogout} variant="outline" className="gap-1.5">
              <LogOut className="size-4" />
              Đăng xuất
            </Button>
          </div>

          {verification && (
            <div className={verification.ok ? "mt-3 rounded-lg border border-success/30 bg-success/10 p-3 text-sm" : "mt-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm"}>
              {verification.message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-muted/40 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

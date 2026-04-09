"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

import { registerAccount, getStudentById } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  const student = useMemo(() => getStudentById(studentId.trim()), [studentId]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setStatus({ ok: false, message: "Mật khẩu xác nhận không khớp." });
      return;
    }

    const result = registerAccount(studentId, password);
    setStatus(result);

    if (result.ok) {
      setTimeout(() => router.push("/dang-nhap"), 700);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col justify-center px-4 py-8">
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="size-4" />
            Đăng ký tài khoản
          </CardTitle>
          <CardDescription>
            Tạo tài khoản bằng mã sinh viên. Hệ thống sẽ kiểm tra thông tin trong student.json.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={onSubmit}>
            <div className="space-y-1">
              <label htmlFor="student-id" className="text-xs text-muted-foreground">Mã sinh viên</label>
              <Input
                id="student-id"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="VD: 2A202600205"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-xs text-muted-foreground">Mật khẩu</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="confirm-password" className="text-xs text-muted-foreground">Xác nhận mật khẩu</label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
              />
            </div>

            {student && (
              <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-xs">
                <p className="font-medium">Đã tìm thấy người dùng:</p>
                <p>{student.name} - {student.major}</p>
              </div>
            )}

            {status && (
              <div className={status.ok ? "rounded-lg border border-success/30 bg-success/10 p-3 text-xs" : "rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs"}>
                {status.message}
              </div>
            )}

            <Button type="submit" className="w-full">Đăng ký</Button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground">
            Đã có tài khoản? <Link href="/dang-nhap" className="text-primary underline">Đăng nhập</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

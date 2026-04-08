"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";

const STEPS = [
  {
    step: 1,
    title: "Mô tả yêu cầu",
    description: "Nhập bằng ngôn ngữ tự nhiên, VinAgent sẽ hiểu ý bạn.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    step: 2,
    title: "Xem phương án",
    description: "Hiển thị lịch học trên calendar, so sánh Plan A/B.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    step: 3,
    title: "Xác nhận & đăng ký",
    description: "Kiểm tra nguồn, xác nhận phương án và tiến hành đăng ký.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-53px)] flex-col items-center justify-center px-4 py-12">
      <FadeIn>
        <div className="flex flex-col items-center text-center">
          <Image src="/vinuni-logo.png" alt="VinUniversity" width={180} height={48} className="h-10 w-auto mb-6" priority />
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            <span className="gradient-text">Cố vấn học vụ</span> thông minh
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted md:text-base">
            Tối ưu đăng ký học phần bằng ngôn ngữ tự nhiên.
            Mọi đề xuất đều có trích dẫn nguồn và có thể kiểm chứng.
          </p>
        </div>
      </FadeIn>

      <Stagger className="mt-10 grid w-full max-w-2xl gap-4 md:grid-cols-3">
        {STEPS.map((s) => (
          <StaggerItem key={s.step}>
            <div className="flex flex-col items-center rounded-2xl border bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {s.icon}
              </div>
              <span className="mt-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                {s.step}
              </span>
              <h3 className="mt-2 text-sm font-bold">{s.title}</h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">{s.description}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <FadeIn delay={0.3}>
        <Link
          href="/tao-ke-hoach"
          className="btn-primary mt-10 inline-flex rounded-xl px-8 py-3.5 text-sm font-bold"
        >
          Bắt đầu tạo lịch học
        </Link>
      </FadeIn>
    </div>
  );
}

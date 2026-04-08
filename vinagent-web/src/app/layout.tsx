import type { Metadata } from "next";
import { Montserrat, JetBrains_Mono } from "next/font/google";

import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "VinAgent — Cố vấn học vụ thông minh",
  description: "Hệ thống cố vấn học vụ AI cho sinh viên VinUniversity. Tối ưu đăng ký học phần bằng ngôn ngữ tự nhiên.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${montserrat.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InterviewVault - Track Your Job Interviews",
  description: "Personal interview tracking and question bank management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth selection:bg-[#ffcf36]/40 selection:text-[#1c2024]`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}

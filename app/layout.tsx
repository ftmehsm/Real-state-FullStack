import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { vazirmatn } from "@/utils/fonts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ملکینو",
  description: "سامانه آگهی املاک ملکینو",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={cn(
        "h-full antialiased",
        vazirmatn.variable,
        geistSans.variable,
        geistMono.variable
      )}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
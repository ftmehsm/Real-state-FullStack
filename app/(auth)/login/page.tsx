import type { Metadata } from "next";
import Link from "next/link";
import { Building2 } from "lucide-react";

import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "ورود | ملکینو",
  description: "ورود به حساب کاربری ملکینو",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-2xl border shadow-lg lg:grid-cols-2">

        {/* Right Side */}
        <div className="flex items-center justify-center p-8">
          <LoginForm />
        </div>

        {/* Left Side */}
        <div className="hidden bg-primary p-8 text-primary-foreground lg:flex lg:flex-col lg:justify-between">

          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="rounded-xl bg-white/10 p-3">
                <Building2 className="h-7 w-7" />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  ملکینو
                </h2>

                <p className="mt-1 text-sm text-primary-foreground/80">
                  سامانه هوشمند آگهی املاک
                </p>
              </div>
            </Link>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold leading-relaxed">
              دوباره خوش آمدی
              <br />
              وارد حساب کاربری‌ات شو.
            </h1>

            <p className="max-w-md leading-8 text-primary-foreground/85">
              با ورود به حساب کاربری خود می‌توانید آگهی‌های خود را مدیریت
              کنید، املاک ذخیره‌شده را مشاهده کنید و سریع‌تر با مشاوران و
              فروشندگان در ارتباط باشید.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-6">

              <div className="rounded-xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur">
                <p className="text-2xl font-bold">+10K</p>
                <span className="text-sm text-primary-foreground/80">
                  آگهی فعال
                </span>
              </div>

              <div className="rounded-xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur">
                <p className="text-2xl font-bold">+3K</p>
                <span className="text-sm text-primary-foreground/80">
                  کاربر
                </span>
              </div>

              <div className="rounded-xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur">
                <p className="text-2xl font-bold">24/7</p>
                <span className="text-sm text-primary-foreground/80">
                  پشتیبانی
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
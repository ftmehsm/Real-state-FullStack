"use client";

import Link from "next/link";
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi2";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupForm() {
  return (
    <div className="flex  items-center justify-center ">
      <div>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">
            ایجاد حساب کاربری
          </CardTitle>

          <CardDescription>
            برای استفاده از امکانات ملکینو ثبت‌نام کنید.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-5">

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">نام و نام خانوادگی</Label>

              <div className="relative">
                <HiOutlineUser className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg" />

                <Input
                  id="name"
                  placeholder="نام و نام خانوادگی"
                  className="pr-10"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>

              <div className="relative">
                <HiOutlineEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg" />

                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  dir="ltr"
                  className="pr-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>

              <div className="relative">
                <HiOutlineLockClosed className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg" />

                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  dir="ltr"
                  className="pr-10"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                تکرار رمز عبور
              </Label>

              <div className="relative">
                <HiOutlineLockClosed className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg" />

                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="********"
                  dir="ltr"
                  className="pr-10"
                />
              </div>
            </div>

            <Button className="w-full h-11">
              ایجاد حساب
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              قبلاً ثبت‌نام کرده‌اید؟

              <Link
                href="/auth/login"
                className="mr-1 font-medium text-primary hover:underline"
              >
                وارد شوید
              </Link>
            </div>

          </form>
        </CardContent>
      </div>
    </div>
  );
}
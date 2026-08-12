"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  User,
  LayoutDashboard,
  FileText,
  PlusCircle,
  LogOut,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type DashboardSidebarProps = {
  user: {
    name: string;
  };
};

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  return (
    <aside className="w-full lg:max-w-72 shrink-0 rounded-2xl border bg-card p-6">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="size-20">
          <AvatarFallback className="text-xl">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="text-center">
          <h2 className="font-bold text-lg">{user.name}</h2>

          <p className="text-sm text-muted-foreground">خوش آمدید</p>
        </div>
      </div>

      <Separator className="my-6" />

      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({
              variant: "ghost",
            }),
            "w-full justify-start",
          )}
        >
          <LayoutDashboard className="ml-2 size-5" />
          اطلاعات حساب کاربری
        </Link>

        <Link
          href="/dashboard/my-ads"
          className={cn(
            buttonVariants({
              variant: "ghost",
            }),
            "w-full justify-start",
          )}
        >
          <FileText className="ml-2 size-5" />
          آگهی‌های من
        </Link>

        

        <Link
          href="/dashboard/create-ad"
          className={cn(
            buttonVariants({
              variant: "ghost",
            }),
            "w-full justify-start",
          )}
        >
          <PlusCircle className="ml-2 size-5" />
          ثبت آگهی
        </Link>

        <Separator className="my-4" />

        <Button
          variant="destructive"
          className="w-full justify-start"
          onClick={() =>
            signOut({
              callbackUrl: "/login",
            })
          }
        >
          <LogOut className="ml-2 size-5" />
          خروج از حساب کاربری
        </Button>
      </nav>
    </aside>
  );
}

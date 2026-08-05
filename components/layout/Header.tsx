"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Building2, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  console.log(session, status);

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto h-16 flex items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-2xl text-primary"
        >
          <Building2 className="h-7 w-7" />
          <span>ملکینو</span>
        </Link>

        {/* Menu */}
        <NavigationMenu>
          <NavigationMenuList className="gap-6">
            <NavigationMenuItem>
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition"
              >
                صفحه اصلی
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                href="/ads"
                className="text-sm font-medium hover:text-primary transition"
              >
                آگهی‌ها
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Actions */}
        {status === "authenticated" ? (
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Link href="/dashboard">پنل کاربری</Link>
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                signOut({
                  callbackUrl: "/login",
                })
              }
            >
              <LogOut className="w-4 h-4 " />
              خروج
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button variant="default">
              <Link href="/login">ورود</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

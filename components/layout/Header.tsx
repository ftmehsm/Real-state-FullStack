"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

export default function Header() {
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
        <div className="flex items-center gap-3">

          <Button variant="ghost">
            <Link href="/login">
              ورود
            </Link>
          </Button>

          <Button variant="ghost">
            <Link href="/register">
              ثبت‌نام
            </Link>
          </Button>

        </div>
      </div>
    </header>
  );
}
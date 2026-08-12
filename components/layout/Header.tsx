"use client";

import Link from "next/link";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Building2, LogOut, Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-primary sm:text-2xl"
        >
          <Building2 className="h-6 w-6 sm:h-7 sm:w-7" />
          <span>ملکینو</span>
        </Link>

        {/* Desktop Menu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-6">
            <NavigationMenuItem>
              <Link
                href="/"
                className="text-sm font-medium transition hover:text-primary"
              >
                صفحه اصلی
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                href="/ads"
                className="text-sm font-medium transition hover:text-primary"
              >
                آگهی‌ها
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {status === "authenticated" ? (
            <>
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                پنل کاربری
              </Link>

              <Button
                variant="destructive"
                onClick={() =>
                  signOut({
                    callbackUrl: "/login",
                  })
                }
              >
                <LogOut className="h-4 w-4" />
                خروج
              </Button>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              ورود
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(true)}
          aria-label="باز کردن منو"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Sidebar - LEFT */}
      <aside
        className={`fixed left-0 top-0 z-[60] flex h-dvh w-[280px] max-w-[85vw] flex-col bg-background shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        dir="rtl"
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-2 text-xl font-bold text-primary"
          >
            <Building2 className="h-6 w-6" />
            <span>ملکینو</span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={closeMenu}
            aria-label="بستن منو"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar Content */}
        <nav className="flex flex-1 flex-col justify-between overflow-y-auto p-4">
          {/* Navigation */}
          <ul>
            <li>
              <Link
                href="/"
                onClick={closeMenu}
                className="block rounded-lg px-4 py-3 text-sm font-medium transition hover:bg-muted hover:text-primary"
              >
                صفحه اصلی
              </Link>
            </li>

            <li>
              <Link
                href="/ads"
                onClick={closeMenu}
                className="block rounded-lg px-4 py-3 text-sm font-medium transition hover:bg-muted hover:text-primary"
              >
                آگهی‌ها
              </Link>
            </li>
          </ul>

          {/* Actions */}
          {status === "authenticated" ? (
            <ul>
              <li>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full",
                  )}
                >
                  پنل کاربری
                </Link>
              </li>

              <li>
                <Button
                  variant="destructive"
                  className="mt-2 h-10 w-full"
                  onClick={() =>
                    signOut({
                      callbackUrl: "/login",
                    })
                  }
                >
                  <LogOut className="h-4 w-4" />
                  خروج
                </Button>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  ورود
                </Link>
              </li>
            </ul>
          )}
        </nav>
      </aside>
    </header>
  );
}

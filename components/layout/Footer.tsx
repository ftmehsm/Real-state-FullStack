"use client";

import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaTelegramPlane } from "react-icons/fa";
import {
  HiBuildingOffice2,
  HiEnvelope,
  HiMapPin,
  HiPhone,
} from "react-icons/hi2";

import { quickLinks, categories } from "./data";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-muted/30 sm:mt-20">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="mb-5 flex w-fit items-center gap-3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <HiBuildingOffice2 className="text-2xl text-primary" />
              </div>

              <div>
                <h3 className="text-lg font-bold">ملکینو</h3>

                <p className="text-xs text-muted-foreground">
                  سامانه هوشمند آگهی املاک
                </p>
              </div>
            </Link>

            <p className="max-w-md text-sm leading-7 text-muted-foreground">
              بستری برای خرید، فروش، رهن و اجاره انواع املاک در سراسر کشور با
              تجربه‌ای سریع، امن و ساده.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold">دسترسی سریع</h4>

            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4 font-semibold">دسته‌بندی املاک</h4>

            <ul className="space-y-3">
              {categories.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold">ارتباط با ما</h4>

            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <HiPhone className="shrink-0 text-lg text-primary" />
                <span dir="ltr">021-12345678</span>
              </div>

              <div className="flex items-center gap-3">
                <HiEnvelope className="shrink-0 text-lg text-primary" />
                <span className="break-all" dir="ltr">
                  info@melkino.ir
                </span>
              </div>

              <div className="flex items-center gap-3">
                <HiMapPin className="shrink-0 text-lg text-primary" />
                <span>تهران، ایران</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              <Link
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-accent hover:text-primary"
              >
                <FaInstagram className="text-lg" />
              </Link>

              <Link
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-accent hover:text-primary"
              >
                <FaLinkedinIn className="text-lg" />
              </Link>

              <Link
                href="#"
                aria-label="Telegram"
                className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-accent hover:text-primary"
              >
                <FaTelegramPlane className="text-lg" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t pt-6 text-center text-xs leading-6 text-muted-foreground sm:mt-12 sm:text-sm">
          © {new Date().getFullYear()} ملکینو - تمامی حقوق این وب‌سایت محفوظ
          است.
        </div>
      </div>
    </footer>
  );
}
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
    <footer className="mt-20 border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <HiBuildingOffice2 className="text-primary text-2xl" />
              </div>

              <div>
                <h3 className="text-lg font-bold">ملکینو</h3>

                <p className="text-xs text-muted-foreground">
                  سامانه هوشمند آگهی املاک
                </p>
              </div>
            </Link>

            <p className="text-sm leading-8 text-muted-foreground">
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
                <HiPhone className="text-lg text-primary" />
                <span>021-12345678</span>
              </div>

              <div className="flex items-center gap-3">
                <HiEnvelope className="text-lg text-primary" />
                <span>info@melkino.ir</span>
              </div>

              <div className="flex items-center gap-3">
                <HiMapPin className="text-lg text-primary" />
                <span>تهران، ایران</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                href="#"
                className="rounded-lg border p-2 transition-colors hover:bg-accent"
              >
                <FaInstagram className="text-lg" />
              </Link>

              <Link
                href="#"
                className="rounded-lg border p-2 transition-colors hover:bg-accent"
              >
                <FaLinkedinIn className="text-lg" />
              </Link>

              <Link
                href="#"
                className="rounded-lg border p-2 transition-colors hover:bg-accent"
              >
                <FaTelegramPlane className="text-lg" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ملکینو - تمامی حقوق این وب‌سایت محفوظ
          است.
        </div>
      </div>
    </footer>
  );
}

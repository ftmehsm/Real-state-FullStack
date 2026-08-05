// app/dashboard/page.tsx

import { getServerSession } from "next-auth";
import Link from "next/link";
import {
  FileText,
  PlusCircle,
  User,
} from "lucide-react";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          داشبورد
        </h1>

        <p className="mt-2 text-muted-foreground">
          {session?.user?.name}، خوش آمدید.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              آگهی‌های من
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              مشاهده، ویرایش و مدیریت آگهی‌های ثبت شده.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
           

            <Button  className="w-full">
              <Link href="/dashboard/my-ads">
                مشاهده آگهی‌ها
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="size-5 text-primary" />
              ثبت آگهی
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              یک آگهی جدید برای ملک خود ثبت کنید.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            

            <Button  className="w-full">
              <Link href="/dashboard/create-ad">
                ثبت آگهی جدید
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5 text-primary" />
              اطلاعات حساب
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">
                نام
              </span>

              <p className="font-medium">
                {session?.user?.name}
              </p>
            </div>

            <div>
              <span className="text-sm text-muted-foreground">
                ایمیل
              </span>

              <p className="font-medium">
                {session?.user?.email}
              </p>
            </div>

            <Button  variant="outline" className="mt-4 w-full">
              <Link href="/dashboard/profile">
                ویرایش اطلاعات
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
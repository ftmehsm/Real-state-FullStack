import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileText, PlusCircle, User } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { User as UserType } from "@/types/User";
import { toJalaliDate } from "@/utils/dateFormatter";

export default function InfoCards({ user }: { user: UserType }) {
  return (
    <div className="grid gap-6 grid-cols-2">
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
          <Button className="w-full">
            <Link href="/dashboard/my-ads">مشاهده آگهی‌ها</Link>
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
          <Button className="w-full">
            <Link href="/dashboard/create-ad">ثبت آگهی جدید</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5 text-primary" />
            اطلاعات حساب
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <div>
            <span className="text-sm text-muted-foreground">نام</span>

            <p className="font-medium">{user?.name}</p>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">ایمیل</span>

            <p className="font-medium">{user?.email}</p>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">تاریخ عضویت</span>

            <p className="font-medium">
              {toJalaliDate(user?.createdAt)}
            </p>
          </div>

          <Button variant="outline" className="mt-4 w-full">
            <Link href="/dashboard/profile">ویرایش اطلاعات</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

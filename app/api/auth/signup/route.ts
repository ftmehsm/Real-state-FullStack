import { NextRequest, NextResponse } from "next/server";

import { signup } from "@/lib/services/auth.services";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    await signup({ email, password, name });

    return NextResponse.json(
      { message: "حساب کاربری با موفقیت ایجاد شد." },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "مشکلی در سرور پیش آمده",
      },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import { hashPassword } from "@/utils/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "ایمیل و رمز عبور الزامی هستند." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "این ایمیل قبلاً ثبت شده است." },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    await User.create({
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "حساب کاربری با موفقیت ایجاد شد." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "خطایی در سرور رخ داده است. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
"use server";

import { signup } from "@/lib/services/auth.services";

type SignupState = {
  success: boolean;
  message: string;
  email?: string;
  password?: string;
};


export async function signupAction(
  prevState: SignupState,
  formData: FormData
): Promise<SignupState> {

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const repeatPassword = formData.get("repeatPassword") as string;


  if (!name || !email || !password || !repeatPassword) {
    return {
      success: false,
      message: "تمامی فیلدها باید کامل شوند",
    };
  }


  if (password !== repeatPassword) {
    return {
      success: false,
      message: "رمز عبور با تکرار رمز عبور یکی نیست",
    };
  }


  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      success: false,
      message: "فرمت ایمیل ورودی معتبر نیست",
    };
  }


  try {

    await signup({
      name,
      email,
      password,
    });


    return {
      success: true,
      message: "حساب کاربری با موفقیت ایجاد شد",
      email,
      password
    };



  } catch (error) {

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "مشکلی در سرور پیش آمده",
    };

  }


  
}
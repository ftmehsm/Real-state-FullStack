"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";

import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineUser,
} from "react-icons/hi2";

import { signupAction } from "@/app/actions/auth.actions.ts";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import SubmitButton from "./SubmitButton";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";


type SignupState = {
  success: boolean;
  message: string;
  email?: string;
  password?: string;
};

const initialState: SignupState = {
  success: false,
  message: "",
};

export default function SignupForm() {
  const [state, formAction] = useActionState(
    signupAction,
    initialState
  );
  const router = useRouter()


  const {email,password,success} = state 
  


  useEffect(() => {
    if (success && email && password) {
      signIn("credentials", {
        email,
        password,
        redirect: false,
      }).then((res) => {
        if (res?.ok) {
          router.push("/");
        }
      });
    }
  }, [success, email, password, router]);

 

  return (
    <div className="w-2/3">

      <CardHeader className="space-y-1 text-center mb-5">
        <CardTitle className="text-3xl font-bold">
          ایجاد حساب کاربری
        </CardTitle>

        <CardDescription>
          برای استفاده از امکانات ملکینو ثبت‌نام کنید.
        </CardDescription>
      </CardHeader>

      <CardContent>

        <form action={formAction} className="space-y-5">

          <div className="space-y-2">
            <Label htmlFor="name">
              نام
            </Label>

            <div className="relative">
              <HiOutlineUser className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg" />

              <Input
                id="name"
                name="name"
                type="text"
                placeholder="نام شما"
                className="pr-10"
              />
            </div>
          </div>


          <div className="space-y-2">
            <Label htmlFor="email">
              ایمیل
            </Label>

            <div className="relative">
              <HiOutlineEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg" />

              <Input
                id="email"
                name="email"
                type="email"
                dir="ltr"
                placeholder="example@email.com"
                className="pr-10"
              />
            </div>
          </div>


          <div className="space-y-2">
            <Label htmlFor="password">
              رمز عبور
            </Label>

            <div className="relative">
              <HiOutlineLockClosed className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg" />

              <Input
                id="password"
                name="password"
                type="password"
                dir="ltr"
                className="pr-10"
                placeholder="********"
              />
            </div>
          </div>


          <div className="space-y-2">
            <Label htmlFor="repeatPassword">
              تکرار رمز عبور
            </Label>

            <div className="relative">
              <HiOutlineLockClosed className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg" />

              <Input
                id="repeatPassword"
                name="repeatPassword"
                type="password"
                dir="ltr"
                className="pr-10"
                placeholder="********"
              />
            </div>
          </div>


          {state.message && (
            <p className="text-sm text-center text-primary">
              {state.message}
            </p>
          )}


          <SubmitButton />


          <div className="text-center text-sm text-muted-foreground">
            قبلاً ثبت‌نام کرده‌اید؟

            <Link
              href="/login"
              className="mr-1 text-primary hover:underline"
            >
              وارد شوید
            </Link>
          </div>

        </form>

      </CardContent>

    </div>
  );
}
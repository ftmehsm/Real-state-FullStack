"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error , setError] = useState("")

  const router = useRouter()

  const loginHandler = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)

    try {
       const res = await signIn("credentials" , {email , password , redirect:false})

       setLoading(false)

       if(res?.error){
        console.log(res?.error)
       }

       router.push("/");

    } catch (error) {
        console.log(error)
    }


  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">ورود به حساب</h1>

        <p className="text-muted-foreground">
          برای ادامه وارد حساب کاربری خود شوید.
        </p>
      </div>

      <form onSubmit={loginHandler} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">ایمیل</Label>

          <div className="relative">
            <HiOutlineEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg" />

            <Input
              id="email"
              name="email"
              type="email"
              dir="ltr"
              placeholder="example@email.com"
              className="pr-10"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">رمز عبور</Label>
          </div>

          <Input
            id="password"
            type="password"
            dir="ltr"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "در حال ورود..." : "ورود"}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        حساب کاربری ندارید؟{" "}
        <Link
          href="/signup"
          className="font-medium text-primary hover:underline"
        >
          ثبت‌نام
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full h-11"
      disabled={pending}
    >
      {pending ? "در حال ثبت..." : "ایجاد حساب"}
    </Button>
  );
}
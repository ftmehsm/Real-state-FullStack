"use client";

import CreateAdForm from "@/components/ads/CreateAdForm";
import { createAdAction } from "@/app/actions/create-ad.action";
import { categories } from "@/const/ad";

export default function CreateAdPage() {
  return (
    <main>
      <CreateAdForm categories={categories} action={createAdAction} />
    </main>
  );
}

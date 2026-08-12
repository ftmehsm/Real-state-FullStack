"use client";

import CreateAdForm from "@/components/ads/CreateAdForm";
import { createAd } from "@/app/actions/create-ad.action";

const categories = ["آپارتمان", "ویلا", "زمین", "مغازه", "دفتر"];

export default function CreateAdPage() {
  return (
    <main>
      <CreateAdForm categories={categories} action={createAd} />
    </main>
  );
}

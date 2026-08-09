"use client"
import CreateAdForm from "@/components/ads/CreateAdForm";
// import { createAd } from "@/app/actions/ad";

const categories = ["آپارتمان", "ویلا", "زمین", "مغازه", "دفتر"];

export default function CreateAdPage() {
  return (
    <main >
      <CreateAdForm
        categories={categories}
        action={() =>
          Promise.resolve({
            success: true,
            message: "Ad created successfully",
            errors: {},
          })
        }
      />
    </main>
  );
}

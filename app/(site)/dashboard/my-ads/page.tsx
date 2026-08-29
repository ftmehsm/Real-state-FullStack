import Link from "next/link";
import { FiPlus, FiFileText } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import MyAdCard from "@/components/ads/MyAdCard";

import { getMyAds } from "@/lib/services/ad.services";
import { deleteAdAction } from "@/app/actions/ad.actions";
import getCurrentUser from "@/utils/getCurrentUser";

export default async function MyAdsPage() {
  const user = await getCurrentUser();

  const ads = await getMyAds(user._id); 

  console.log(ads)
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl  py-8 ">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">آگهی‌های من</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              مدیریت آگهی‌هایی که در ملکینو ثبت کرده‌اید
            </p>
          </div>

          <Button>
            <Link href="create-ad" className="flex items-center gap-1">
              <FiPlus />
              ثبت آگهی جدید
            </Link>
          </Button>
        </div>

        {/* Ads */}
        {ads.length > 0 ? (
          <div className="space-y-4">
            {ads.map((ad) => (
              <MyAdCard key={ad._id} ad={ad} deleteAction={deleteAdAction} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
              <FiFileText className="size-6 text-muted-foreground" />
            </div>

            <h2 className="text-lg font-semibold">
              هنوز آگهی‌ای ثبت نکرده‌اید
            </h2>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              اولین آگهی خود را در ملکینو ثبت کنید و ملک خود را در معرض دید
              خریداران و مستأجران قرار دهید.
            </p>

            <Button className="mt-5">
              <Link href="/ads/create">
                <FiPlus />
                ثبت اولین آگهی
              </Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

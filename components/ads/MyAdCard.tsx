import Link from "next/link";
import Image from "next/image";
import { FiEdit2, FiTrash2, FiMapPin, FiHome } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Ad } from "@/types/types";
import findCat, { getAdTypeLabel } from "@/utils/help";

type MyAdCardProps = {
  ad: Ad;
  deleteAction: (formData: FormData) => void | Promise<void>;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fa-IR").format(price);
};

const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export default function MyAdCard({ ad, deleteAction }: MyAdCardProps) {
  const mainImage = ad.images?.[0]?.url;

  return (
    <Card className="overflow-hidden !pt-0">
      <div className="grid md:grid-cols-[300px_1fr]">
        {/* Image */}
        <Link
          href={`/ads/${ad._id}`}
          className="relative aspect-square bg-muted md:aspect-auto md:min-h-55"
        >
          <div className="h-full">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={ad.name}
                fill
                loading="eager"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full min-h-55 items-center justify-center">
                <FiHome className="size-10 text-muted-foreground" />
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex min-w-0 flex-col">
          <CardContent className="flex-1 p-4">
            {/* Type + Dates */}
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <Badge variant="secondary">
                {getAdTypeLabel(ad.transactionType)}
              </Badge>

              <div className="flex flex-wrap items-center justify-end gap-2">
                {" "}
                <Badge variant="secondary">
                  {" "}
                  ایجاد: {formatDate(ad.createdAt)}{" "}
                </Badge>{" "}
                <Badge variant="default">
                  {" "}
                  بروزرسانی: {formatDate(ad.updatedAt)}{" "}
                </Badge>{" "}
              </div>
            </div>

            {/* Title */}
            <Link href={`/ads/${ad._id}`}>
              <h2 className="mb-3 line-clamp-1 text-lg font-semibold">
                {ad.name}
              </h2>
            </Link>

            {/* Address */}
            <div className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
              <FiMapPin className="size-4 shrink-0" />

              <span className="line-clamp-1">{ad.address}</span>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              {/* Area */}
              <div>
                <p className="text-muted-foreground">متراژ</p>

                <p className="mt-1 font-medium">{formatPrice(ad.area)} متر</p>
              </div>

              {/* Category */}
              <div>
                <p className="text-muted-foreground">نوع ملک</p>

                <p className="mt-1 font-medium">{findCat(ad.category)}</p>
              </div>

              {/* Construction Date */}
              <div>
                <p className="text-muted-foreground">سال ساخت</p>

                <p className="mt-1 font-medium">{ad.constructionDate}</p>
              </div>
            </div>

            {/* Price */}
            <div className="mt-5">
              {ad.transactionType === "buy" ? (
                <>
                  <p className="text-sm text-muted-foreground">قیمت</p>

                  {ad.price !== undefined && (
                    <p className="mt-1 text-lg font-bold text-primary">
                      {formatPrice(ad.price)} تومان
                    </p>
                  )}
                </>
              ) : (
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">ودیعه</p>

                    {ad.deposit !== undefined && (
                      <p className="mt-1 text-lg font-bold text-primary">
                        {formatPrice(ad.deposit)} تومان
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">اجاره</p>

                    {ad.rent !== undefined && (
                      <p className="mt-1 font-semibold text-primary">
                        {formatPrice(ad.rent)} تومان
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          {/* Actions */}
          <CardFooter className="justify-end gap-2 border-t bg-muted/30 p-4">
            <Button variant="outline" size="sm">
              <Link
                href={`my-ads/${ad._id}/edit`}
                className="flex items-center gap-1"
              >
                <FiEdit2 />
                ویرایش
              </Link>
            </Button>

            <form action={deleteAction}>
              <input type="hidden" name="id" value={ad._id} />

              <Button type="submit" variant="destructive" size="sm">
                <FiTrash2 />
                حذف
              </Button>
            </form>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}

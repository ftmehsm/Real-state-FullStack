import { categories } from "@/const/ad";
import { Ad } from "@/types/types";

export default function findCat(cat: string) {
  const category = categories.find((item) => item.key === cat);

  return category?.name;
}

export const getAdTypeLabel = (type: Ad["transactionType"]) => {
  return type === "buy" ? "فروش" : "اجاره";
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fa-IR").format(price);
};

export const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

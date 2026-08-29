import { categories } from "@/const/ad";
import { Ad } from "@/types/types";

export default function findCat(cat: string) {
  const category = categories.find((item) => item.key === cat);

  return category?.name;
}

export const getAdTypeLabel = (type: Ad["transactionType"]) => {
  return type === "buy" ? "فروش" : "اجاره";
};

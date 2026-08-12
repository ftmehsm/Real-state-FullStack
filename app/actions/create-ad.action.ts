"use server";

import type { AdActionState } from "@/types/types";

export async function createAd(
  _prevState: AdActionState,
  formData: FormData,
): Promise<AdActionState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const category = formData.get("category")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const description =
    formData.get("description")?.toString().trim() ?? "";
  const address = formData.get("address")?.toString().trim() ?? "";
  const transactionType =
    formData.get("transactionType")?.toString().trim() ?? "";
  const area = formData.get("area")?.toString().trim() ?? "";

  const price = formData.get("price")?.toString().trim() ?? "";
  const deposit = formData.get("deposit")?.toString().trim() ?? "";
  const rent = formData.get("rent")?.toString().trim() ?? "";

  const constructionDate =
    formData.get("constructionDate")?.toString().trim() ?? "";

  const errors: AdActionState["errors"] = {};

  if (!name) {
    errors.name = "پر کردن این فیلد الزامی است";
  }

  if (!category) {
    errors.category = "پر کردن این فیلد الزامی است";
  }

  if (!phone) {
    errors.phone = "پر کردن این فیلد الزامی است";
  }

  if (!description) {
    errors.description = "پر کردن این فیلد الزامی است";
  }

  if (!address) {
    errors.address = "پر کردن این فیلد الزامی است";
  }

  if (!transactionType) {
    errors.transactionType = "پر کردن این فیلد الزامی است";
  }

  if (!area) {
    errors.area = "پر کردن این فیلد الزامی است";
  }

  if (!constructionDate) {
    errors.constructionDate = "پر کردن این فیلد الزامی است";
  }

  // اگر خرید است
  if (transactionType === "buy" && !price) {
    errors.price = "پر کردن این فیلد الزامی است";
  }

  // اگر اجاره است
  if (transactionType === "rent") {
    if (!deposit) {
      errors.deposit = "پر کردن این فیلد الزامی است";
    }

    if (!rent) {
      errors.rent = "پر کردن این فیلد الزامی است";
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "لطفاً فیلدهای الزامی را تکمیل کنید.",
      errors,
    };
  }

  const data = {
    name,
    category,
    phone,
    description,
    address,
    transactionType,
    area,
    price,
    deposit,
    rent,
    constructionDate,

    amenities: formData
      .getAll("amenities")
      .filter(
        (item) => typeof item === "string" && item.trim() !== "",
      ),

    rules: formData
      .getAll("rules")
      .filter(
        (item) => typeof item === "string" && item.trim() !== "",
      ),
  };

  console.log("CREATE AD DATA:", data);

  return {
    success: true,
    message: "آگهی با موفقیت دریافت شد.",
    errors: {},
  };
}
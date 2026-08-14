"use server";

import { createAd } from "@/lib/services/ads.services";
import type {
  AdActionState,
  TransactionType,
  Ad
} from "@/types/types";

function isTransactionType(
  value: string,
): value is TransactionType {
  return value === "buy" || value === "rent";
}

export async function createAdAction(
  _prevState: AdActionState,
  formData: FormData,
): Promise<AdActionState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const category = formData.get("category")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const agency = formData.get("agency")?.toString().trim() ?? "";
  const description =
    formData.get("description")?.toString().trim() ?? "";
  const address = formData.get("address")?.toString().trim() ?? "";

  const transactionTypeRaw =
    formData.get("transactionType")?.toString().trim() ?? "";

  const area = formData.get("area")?.toString().trim() ?? "";

  const price = formData.get("price")?.toString().trim() ?? "";
  const deposit = formData.get("deposit")?.toString().trim() ?? "";
  const rent = formData.get("rent")?.toString().trim() ?? "";

  const constructionDate =
    formData.get("constructionDate")?.toString().trim() ?? "";

  const errors: AdActionState["errors"] = {};

  // -------------------------
  // اعتبارسنجی فیلدهای اصلی
  // -------------------------

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

  if (!area) {
    errors.area = "پر کردن این فیلد الزامی است";
  }

  if (!constructionDate) {
    errors.constructionDate =
      "پر کردن این فیلد الزامی است";
  }

  // -------------------------
  // بررسی TransactionType
  // -------------------------

  if (!isTransactionType(transactionTypeRaw)) {
    errors.transactionType = !transactionTypeRaw
      ? "پر کردن این فیلد الزامی است"
      : "نوع معامله نامعتبر است";
  }

  // -------------------------
  // اعتبارسنجی قیمت
  // -------------------------

  if (transactionTypeRaw === "buy" && !price) {
    errors.price = "پر کردن این فیلد الزامی است";
  }

  if (transactionTypeRaw === "rent") {
    if (!deposit) {
      errors.deposit = "پر کردن این فیلد الزامی است";
    }

    if (!rent) {
      errors.rent = "پر کردن این فیلد الزامی است";
    }
  }

  // -------------------------
  // اگر خطاهای معمولی وجود دارد
  // -------------------------

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "لطفاً فیلدهای الزامی را تکمیل کنید.",
      errors,
    };
  }

  // -------------------------
  // اینجا TypeScript می‌داند:
  // transactionTypeRaw = "buy" | "rent"
  // -------------------------

  if (!isTransactionType(transactionTypeRaw)) {
    return {
      success: false,
      message: "نوع معامله نامعتبر است.",
      errors: {
        transactionType: "نوع معامله نامعتبر است",
      },
    };
  }

  const transactionType: TransactionType = transactionTypeRaw;

  // -------------------------
  // تبدیل مقادیر عددی
  // -------------------------

  const areaNumber = Number(area);
  const priceNumber = price ? Number(price) : 0;
  const depositNumber = deposit ? Number(deposit) : 0;
  const rentNumber = rent ? Number(rent) : 0;

  // -------------------------
  // بررسی عدد بودن متراژ
  // -------------------------

  if (!Number.isFinite(areaNumber) || areaNumber < 0) {
    return {
      success: false,
      message: "مقدار متراژ نامعتبر است.",
      errors: {
        area: "متراژ باید یک عدد معتبر باشد",
      },
    };
  }

  // -------------------------
  // بررسی مبلغ خرید
  // -------------------------

  if (
    transactionType === "buy" &&
    (!Number.isFinite(priceNumber) || priceNumber < 0)
  ) {
    return {
      success: false,
      message: "مبلغ نامعتبر است.",
      errors: {
        price: "مبلغ باید یک عدد معتبر باشد",
      },
    };
  }

  // -------------------------
  // بررسی اطلاعات اجاره
  // -------------------------

  if (transactionType === "rent") {
    if (
      !Number.isFinite(depositNumber) ||
      depositNumber < 0
    ) {
      return {
        success: false,
        message: "مبلغ ودیعه نامعتبر است.",
        errors: {
          deposit: "ودیعه باید یک عدد معتبر باشد",
        },
      };
    }

    if (!Number.isFinite(rentNumber) || rentNumber < 0) {
      return {
        success: false,
        message: "مبلغ اجاره نامعتبر است.",
        errors: {
          rent: "اجاره باید یک عدد معتبر باشد",
        },
      };
    }
  }

  // -------------------------
  // امکانات
  // -------------------------

  const amenities = formData
    .getAll("amenities")
    .filter(
      (item): item is string =>
        typeof item === "string" &&
        item.trim() !== "",
    )
    .map((item) => item.trim());

  // -------------------------
  // قوانین
  // -------------------------

  const rules = formData
    .getAll("rules")
    .filter(
      (item): item is string =>
        typeof item === "string" &&
        item.trim() !== "",
    )
    .map((item) => item.trim());

  // -------------------------
  // داده نهایی مطابق Ad
  // -------------------------

  const data = {
    name,
    category,
    agency,
    phone,
    description,
    address,

    transactionType,

    area: areaNumber,

    price: priceNumber,
    deposit: depositNumber,
    rent: rentNumber,

    constructionDate,

    amenities,
    rules,
  };

  const createdAd = await createAd(data);

  return {
    success: true,
    data : createdAd ,
    message: "آگهی با موفقیت دریافت شد.",
    errors: {},
  };
}
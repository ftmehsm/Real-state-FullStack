"use server";

import { createAd } from "@/lib/services/create-ad.services";

import type {
  AdActionState,
  TransactionType,
} from "@/types/types";

type AdImage = {
  url: string;
  key: string;
};

function isTransactionType(
  value: string,
): value is TransactionType {
  return value === "buy" || value === "rent";
}

function parseImages(value: string): AdImage[] | null {
  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return null;
    }

    const images: AdImage[] = [];

    for (const item of parsed) {
      if (
        typeof item !== "object" ||
        item === null ||
        !("url" in item) ||
        !("key" in item)
      ) {
        return null;
      }

      const url = item.url;
      const key = item.key;

      if (
        typeof url !== "string" ||
        typeof key !== "string" ||
        !url.trim() ||
        !key.trim()
      ) {
        return null;
      }

      images.push({
        url: url.trim(),
        key: key.trim(),
      });
    }

    return images;
  } catch {
    return null;
  }
}

export async function createAdAction(
  _prevState: AdActionState,
  formData: FormData,
): Promise<AdActionState> {
  const name =
    formData.get("name")?.toString().trim() ?? "";

  const category =
    formData.get("category")?.toString().trim() ?? "";

  const phone =
    formData.get("phone")?.toString().trim() ?? "";

  const agency =
    formData.get("agency")?.toString().trim() ?? "";

  const description =
    formData.get("description")?.toString().trim() ?? "";

  const address =
    formData.get("address")?.toString().trim() ?? "";

  const transactionTypeRaw =
    formData.get("transactionType")?.toString().trim() ?? "";

  const area =
    formData.get("area")?.toString().trim() ?? "";

  const price =
    formData.get("price")?.toString().trim() ?? "";

  const deposit =
    formData.get("deposit")?.toString().trim() ?? "";

  const rent =
    formData.get("rent")?.toString().trim() ?? "";

  const constructionDate =
    formData.get("constructionDate")?.toString().trim() ?? "";

  const imagesRaw =
    formData.get("images")?.toString() ?? "[]";

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
  // transactionType
  // -------------------------

  if (!isTransactionType(transactionTypeRaw)) {
    errors.transactionType = !transactionTypeRaw
      ? "پر کردن این فیلد الزامی است"
      : "نوع معامله نامعتبر است";
  }

  // -------------------------
  // تصاویر
  // -------------------------

  const images = parseImages(imagesRaw);

  if (images === null) {
    errors.images = "اطلاعات تصاویر نامعتبر است.";
  } else if (images.length === 0) {
    errors.images = "حداقل یک تصویر برای آگهی انتخاب کنید.";
  } else if (images.length > 10) {
    errors.images = "حداکثر ۱۰ تصویر مجاز است.";
  }

  // -------------------------
  // اعتبارسنجی قیمت
  // -------------------------

  if (transactionTypeRaw === "buy" && !price) {
    errors.price = "پر کردن این فیلد الزامی است";
  }

  if (transactionTypeRaw === "rent") {
    if (!deposit) {
      errors.deposit =
        "پر کردن این فیلد الزامی است";
    }

    if (!rent) {
      errors.rent =
        "پر کردن این فیلد الزامی است";
    }
  }

  // -------------------------
  // خطاهای اولیه
  // -------------------------

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "لطفاً فیلدهای الزامی را تکمیل کنید.",
      errors,
    };
  }

  // -------------------------
  // Type narrowing
  // -------------------------

  if (!isTransactionType(transactionTypeRaw)) {
    return {
      success: false,
      message: "نوع معامله نامعتبر است.",
      errors: {
        transactionType:
          "نوع معامله نامعتبر است",
      },
    };
  }

  if (!images) {
    return {
      success: false,
      message: "اطلاعات تصاویر نامعتبر است.",
      errors: {
        images: "تصاویر نامعتبر هستند.",
      },
    };
  }

  const transactionType: TransactionType =
    transactionTypeRaw;

  // -------------------------
  // تبدیل عددها
  // -------------------------

  const areaNumber = Number(area);

  const priceNumber = price
    ? Number(price)
    : undefined;

  const depositNumber = deposit
    ? Number(deposit)
    : undefined;

  const rentNumber = rent
    ? Number(rent)
    : undefined;

  // -------------------------
  // بررسی متراژ
  // -------------------------

  if (
    !Number.isFinite(areaNumber) ||
    areaNumber < 0
  ) {
    return {
      success: false,
      message: "مقدار متراژ نامعتبر است.",
      errors: {
        area: "متراژ باید یک عدد معتبر باشد",
      },
    };
  }

  // -------------------------
  // بررسی خرید
  // -------------------------

  if (
    transactionType === "buy" &&
    (
      priceNumber === undefined ||
      !Number.isFinite(priceNumber) ||
      priceNumber < 0
    )
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
  // بررسی اجاره
  // -------------------------

  if (transactionType === "rent") {
    if (
      depositNumber === undefined ||
      !Number.isFinite(depositNumber) ||
      depositNumber < 0
    ) {
      return {
        success: false,
        message: "مبلغ ودیعه نامعتبر است.",
        errors: {
          deposit:
            "ودیعه باید یک عدد معتبر باشد",
        },
      };
    }

    if (
      rentNumber === undefined ||
      !Number.isFinite(rentNumber) ||
      rentNumber < 0
    ) {
      return {
        success: false,
        message: "مبلغ اجاره نامعتبر است.",
        errors: {
          rent:
            "اجاره باید یک عدد معتبر باشد",
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
  // داده نهایی
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
    constructionDate,
    amenities,
    rules,
    images,

    ...(transactionType === "buy"
      ? {
          price: priceNumber,
        }
      : {
          deposit: depositNumber,
          rent: rentNumber,
        }),
  };

  // -------------------------
  // Service
  // -------------------------

  try {
    const createdAd = await createAd(data);

    return {
      success: true,
      data: createdAd,
      message: "آگهی با موفقیت ایجاد شد.",
      errors: {},
    };
  } catch (error) {
    console.error("createAdAction error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "خطایی در ایجاد آگهی رخ داد.",
      errors: {},
    };
  }
}
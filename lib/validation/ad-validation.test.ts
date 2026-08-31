import { describe, expect, it } from "vitest";

import {
  validateAdForm,
  type AdImage,
} from "@/lib/validation/ad-validation";

function createFormData(
  values: Record<string, string | string[]>,
) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        formData.append(key, item);
      }
    } else {
      formData.set(key, value);
    }
  }

  return formData;
}

const validImages: AdImage[] = [
  {
    url: "https://ufs.sh/f/image-1",
    key: "image-1",
  },
  {
    url: "https://ufs.sh/f/image-2",
    key: "image-2",
  },
];

function validFormData(
  overrides: Record<string, string | string[]> = {},
) {
  return createFormData({
    name: "آپارتمان ۱۲۰ متری",
    category: "apartment",
    phone: "09123456789",
    agency: "املاک مرکزی",
    description: "آپارتمان نوساز",
    address: "تهران، منطقه ۲",
    transactionType: "buy",
    area: "120",
    price: "5000000000",
    constructionDate: "1402/01/01",
    amenities: ["پارکینگ", "آسانسور"],
    rules: ["بدون حیوان خانگی"],
    images: JSON.stringify(validImages),
    ...overrides,
  });
}

describe("validateAdForm", () => {
  it("should validate a valid buy ad", () => {
    const formData = validFormData();

    const result = validateAdForm(formData);

    expect(result.success).toBe(true);

    if (!result.success) return;

    expect(result.data).toEqual({
      name: "آپارتمان ۱۲۰ متری",
      category: "apartment",
      agency: "املاک مرکزی",
      phone: "09123456789",
      description: "آپارتمان نوساز",
      address: "تهران، منطقه ۲",
      transactionType: "buy",
      area: 120,
      constructionDate: "1402/01/01",
      amenities: [
        "پارکینگ",
        "آسانسور",
      ],
      rules: [
        "بدون حیوان خانگی",
      ],
      images: validImages,
      price: 5000000000,
    });
  });

  it("should reject missing required fields", () => {
    const formData = new FormData();

    const result = validateAdForm(formData);

    expect(result.success).toBe(false);

    if (result.success) return;

    expect(result.message).toBe(
      "لطفاً فیلدهای الزامی را تکمیل کنید.",
    );

    expect(result.errors).toMatchObject({
      name: expect.any(String),
      category: expect.any(String),
      phone: expect.any(String),
      description: expect.any(String),
      address: expect.any(String),
      area: expect.any(String),
      constructionDate: expect.any(String),
      transactionType: expect.any(String),
      images: expect.any(String),
    });
  });

  it("should reject invalid transaction type", () => {
    const formData = validFormData({
      transactionType: "invalid",
    });

    const result = validateAdForm(formData);

    expect(result.success).toBe(false);

    if (result.success) return;

    expect(result.errors?.transactionType).toBe(
      "نوع معامله نامعتبر است",
    );
  });

  it("should require price for buy", () => {
    const formData = validFormData({
      transactionType: "buy",
      price: "",
    });

    const result = validateAdForm(formData);

    expect(result.success).toBe(false);

    if (result.success) return;

    expect(result.errors?.price).toBe(
      "پر کردن این فیلد الزامی است",
    );
  });

  it("should reject invalid buy price", () => {
    const formData = validFormData({
      transactionType: "buy",
      price: "-100",
    });

    const result = validateAdForm(formData);

    expect(result.success).toBe(false);

    if (result.success) return;

    expect(result.errors?.price).toBe(
      "مبلغ باید یک عدد معتبر باشد",
    );
  });

  it("should reject non-numeric buy price", () => {
    const formData = validFormData({
      transactionType: "buy",
      price: "abc",
    });

    const result = validateAdForm(formData);

    expect(result.success).toBe(false);

    if (result.success) return;

    expect(result.errors?.price).toBe(
      "مبلغ باید یک عدد معتبر باشد",
    );
  });

  it("should require deposit and rent for rent", () => {
    const formData = validFormData({
      transactionType: "rent",
      price: "",
      deposit: "",
      rent: "",
    });

    const result = validateAdForm(formData);

    expect(result.success).toBe(false);

    if (result.success) return;

    expect(result.errors?.deposit).toBe(
      "پر کردن این فیلد الزامی است",
    );

    expect(result.errors?.rent).toBe(
      "پر کردن این فیلد الزامی است",
    );
  });

  it("should validate a valid rent ad", () => {
    const formData = validFormData({
      transactionType: "rent",
      price: "",
      deposit: "500000000",
      rent: "15000000",
    });

    const result = validateAdForm(formData);

    expect(result.success).toBe(true);

    if (!result.success) return;

    expect(result.data).toMatchObject({
      transactionType: "rent",
      deposit: 500000000,
      rent: 15000000,
    });

    expect(result.data).not.toHaveProperty("price");
  });

  it("should reject invalid deposit", () => {
    const formData = validFormData({
      transactionType: "rent",
      price: "",
      deposit: "-100",
      rent: "15000000",
    });

    const result = validateAdForm(formData);

    expect(result.success).toBe(false);

    if (result.success) return;

    expect(result.errors?.deposit).toBe(
      "ودیعه باید یک عدد معتبر باشد",
    );
  });

  it("should reject invalid rent", () => {
    const formData = validFormData({
      transactionType: "rent",
      price: "",
      deposit: "500000000",
      rent: "-100",
    });

    const result = validateAdForm(formData);

    expect(result.success).toBe(false);

    if (result.success) return;

    expect(result.errors?.rent).toBe(
      "اجاره باید یک عدد معتبر باشد",
    );
  });

  it("should reject invalid area", () => {
    const formData = validFormData({
      area: "-20",
    });

    const result = validateAdForm(formData);

    expect(result.success).toBe(false);

    if (result.success) return;

    expect(result.errors?.area).toBe(
      "متراژ باید یک عدد معتبر باشد",
    );
  });

  it("should reject non-numeric area", () => {
    const formData = validFormData({
      area: "abc",
    });

    const result = validateAdForm(formData);

    expect(result.success).toBe(false);

    if (result.success) return;

    expect(result.errors?.area).toBe(
      "متراژ باید یک عدد معتبر باشد",
    );
  });

  it("should reject invalid images JSON", () => {
    const formData = validFormData({
      images: "invalid-json",
    });

    const result = validateAdForm(formData);

    expect(result.success).toBe(false);

    if (result.success) return;

    expect(result.errors?.images).toBe(
      "اطلاعات تصاویر نامعتبر است.",
    );
  });

  it("should require at least one image", () => {
    const formData = validFormData({
      images: JSON.stringify([]),
    });

    const result = validateAdForm(formData);

    expect(result.success).toBe(false);

    if (result.success) return;

    expect(result.errors?.images).toBe(
      "حداقل یک تصویر برای آگهی انتخاب کنید.",
    );
  });

  it("should reject more than 10 images", () => {
    const images = Array.from(
      { length: 11 },
      (_, index) => ({
        url: `https://ufs.sh/f/image-${index}`,
        key: `image-${index}`,
      }),
    );

    const formData = validFormData({
      images: JSON.stringify(images),
    });

    const result = validateAdForm(formData);

    expect(result.success).toBe(false);

    if (result.success) return;

    expect(result.errors?.images).toBe(
      "حداکثر ۱۰ تصویر مجاز است.",
    );
  });

  it("should parse amenities correctly", () => {
    const formData = validFormData({
      amenities: [
        " پارکینگ ",
        "آسانسور",
        "",
        "  ",
      ],
    });

    const result = validateAdForm(formData);

    expect(result.success).toBe(true);

    if (!result.success) return;

    expect(result.data.amenities).toEqual([
      "پارکینگ",
      "آسانسور",
    ]);
  });

  it("should parse rules correctly", () => {
    const formData = validFormData({
      rules: [
        " بدون حیوان خانگی ",
        "",
        "  ",
      ],
    });

    const result = validateAdForm(formData);

    expect(result.success).toBe(true);

    if (!result.success) return;

    expect(result.data.rules).toEqual([
      "بدون حیوان خانگی",
    ]);
  });

  it("should ignore price for rent", () => {
    const formData = validFormData({
      transactionType: "rent",
      price: "999999999",
      deposit: "500000000",
      rent: "15000000",
    });

    const result = validateAdForm(formData);

    expect(result.success).toBe(true);

    if (!result.success) return;

    expect(result.data).not.toHaveProperty("price");

    expect(result.data).toMatchObject({
      transactionType: "rent",
      deposit: 500000000,
      rent: 15000000,
    });
  });

  it("should ignore deposit and rent for buy", () => {
    const formData = validFormData({
      transactionType: "buy",
      price: "3000000000",
      deposit: "100000000",
      rent: "1000000",
    });

    const result = validateAdForm(formData);

    expect(result.success).toBe(true);

    if (!result.success) return;

    expect(result.data).toMatchObject({
      transactionType: "buy",
      price: 3000000000,
    });

    expect(result.data).not.toHaveProperty("deposit");
    expect(result.data).not.toHaveProperty("rent");
  });
});
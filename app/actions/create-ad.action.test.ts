import { describe, expect, it, vi, beforeEach } from "vitest";

import { createAdAction } from "@/app/actions/create-ad.action";
import { createAd } from "@/lib/services/create-ad.services";

vi.mock("@/lib/services/create-ad.services", () => ({
  createAd: vi.fn(),
}));

const mockedCreateAd = vi.mocked(createAd);

const previousState = {
  success: false,
  data: undefined,
  errors: {},
};

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

const validImages = [
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

describe("createAdAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create an ad successfully", async () => {
    mockedCreateAd.mockResolvedValue({
      id: "ad-1",
      name: "آپارتمان ۱۲۰ متری",
      transactionType: "buy",
      images: validImages,
    } as never);

    const formData = validFormData();

    const result = await createAdAction(
      previousState,
      formData,
    );

    expect(result.success).toBe(true);

    expect(result.message).toBe(
      "آگهی با موفقیت ایجاد شد.",
    );

    expect(result.errors).toEqual({});

    expect(mockedCreateAd).toHaveBeenCalledTimes(1);

    expect(mockedCreateAd).toHaveBeenCalledWith({
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

  it("should reject missing required fields", async () => {
    const formData = new FormData();

    const result = await createAdAction(
      previousState,
      formData,
    );

    expect(result.success).toBe(false);

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

    expect(mockedCreateAd).not.toHaveBeenCalled();
  });

  it("should reject invalid transaction type", async () => {
    const formData = validFormData({
      transactionType: "invalid",
    });

    const result = await createAdAction(
      previousState,
      formData,
    );

    expect(result.success).toBe(false);

    expect(result.errors?.transactionType).toBe(
      "نوع معامله نامعتبر است",
    );

    expect(mockedCreateAd).not.toHaveBeenCalled();
  });

  it("should require price for buy", async () => {
    const formData = validFormData({
      price: "",
    });

    const result = await createAdAction(
      previousState,
      formData,
    );

    expect(result.success).toBe(false);

    expect(result.errors?.price).toBe(
      "پر کردن این فیلد الزامی است",
    );

    expect(mockedCreateAd).not.toHaveBeenCalled();
  });

  it("should send only price for buy", async () => {
    mockedCreateAd.mockResolvedValue({
      id: "ad-1",
      name: "آپارتمان",
      transactionType: "buy",
      images: validImages,
    } as never);

    const formData = validFormData({
      transactionType: "buy",
      price: "3000000000",
      deposit: "100000000",
      rent: "1000000",
    });

    await createAdAction(
      previousState,
      formData,
    );

    const data = mockedCreateAd.mock.calls[0][0];

    expect(data).toMatchObject({
      transactionType: "buy",
      price: 3000000000,
    });

    expect(data).not.toHaveProperty("deposit");
    expect(data).not.toHaveProperty("rent");
  });

  it("should require deposit and rent for rent", async () => {
    const formData = validFormData({
      transactionType: "rent",
      price: "",
      deposit: "",
      rent: "",
    });

    const result = await createAdAction(
      previousState,
      formData,
    );

    expect(result.success).toBe(false);

    expect(result.errors?.deposit).toBe(
      "پر کردن این فیلد الزامی است",
    );

    expect(result.errors?.rent).toBe(
      "پر کردن این فیلد الزامی است",
    );

    expect(mockedCreateAd).not.toHaveBeenCalled();
  });

  it("should send deposit and rent for rent", async () => {
    mockedCreateAd.mockResolvedValue({
      id: "ad-2",
      name: "خانه",
      transactionType: "rent",
      images: validImages,
    } as never);

    const formData = validFormData({
      transactionType: "rent",
      price: "",
      deposit: "500000000",
      rent: "15000000",
    });

    await createAdAction(
      previousState,
      formData,
    );

    const data = mockedCreateAd.mock.calls[0][0];

    expect(data).toMatchObject({
      transactionType: "rent",
      deposit: 500000000,
      rent: 15000000,
    });

    expect(data).not.toHaveProperty("price");
  });

  it("should reject invalid area", async () => {
    const formData = validFormData({
      area: "-20",
    });

    const result = await createAdAction(
      previousState,
      formData,
    );

    expect(result.success).toBe(false);

    expect(result.errors?.area).toBe(
      "متراژ باید یک عدد معتبر باشد",
    );

    expect(mockedCreateAd).not.toHaveBeenCalled();
  });

  it("should reject invalid images JSON", async () => {
    const formData = validFormData({
      images: "invalid-json",
    });

    const result = await createAdAction(
      previousState,
      formData,
    );

    expect(result.success).toBe(false);

    expect(result.errors?.images).toBe(
      "اطلاعات تصاویر نامعتبر است.",
    );

    expect(mockedCreateAd).not.toHaveBeenCalled();
  });

  it("should require at least one image", async () => {
    const formData = validFormData({
      images: JSON.stringify([]),
    });

    const result = await createAdAction(
      previousState,
      formData,
    );

    expect(result.success).toBe(false);

    expect(result.errors?.images).toBe(
      "حداقل یک تصویر برای آگهی انتخاب کنید.",
    );

    expect(mockedCreateAd).not.toHaveBeenCalled();
  });

  it("should reject more than 10 images", async () => {
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

    const result = await createAdAction(
      previousState,
      formData,
    );

    expect(result.success).toBe(false);

    expect(result.errors?.images).toBe(
      "حداکثر ۱۰ تصویر مجاز است.",
    );

    expect(mockedCreateAd).not.toHaveBeenCalled();
  });

  it("should parse amenities and rules correctly", async () => {
    mockedCreateAd.mockResolvedValue({
      id: "ad-3",
      name: "خانه",
      transactionType: "buy",
      images: validImages,
    } as never);

    const formData = validFormData({
      amenities: [
        " پارکینگ ",
        "آسانسور",
        "",
      ],
      rules: [
        " بدون حیوان خانگی ",
        "",
      ],
    });

    await createAdAction(
      previousState,
      formData,
    );

    expect(mockedCreateAd).toHaveBeenCalledWith(
      expect.objectContaining({
        amenities: [
          "پارکینگ",
          "آسانسور",
        ],
        rules: [
          "بدون حیوان خانگی",
        ],
      }),
    );
  });

  it("should return service error", async () => {
    mockedCreateAd.mockRejectedValue(
      new Error("خطا در ایجاد آگهی"),
    );

    const formData = validFormData();

    const result = await createAdAction(
      previousState,
      formData,
    );

    expect(result.success).toBe(false);

    expect(result.message).toBe(
      "خطا در ایجاد آگهی",
    );
  });
});
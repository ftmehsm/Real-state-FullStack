import { beforeEach, describe, expect, it, vi } from "vitest";

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

function createFormData(values: Record<string, string | string[]>) {
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

function validFormData(overrides: Record<string, string | string[]> = {}) {
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

  it("should validate the form before calling createAd", async () => {
    const formData = new FormData();

    const result = await createAdAction(previousState, formData);

    expect(result.success).toBe(false);
    expect(mockedCreateAd).not.toHaveBeenCalled();
  });

  it("should call createAd with validated data", async () => {
    mockedCreateAd.mockResolvedValue({
      id: "ad-1",
      name: "آپارتمان ۱۲۰ متری",
      transactionType: "buy",
      images: validImages,
    } as never);

    const formData = validFormData();

    const result = await createAdAction(previousState, formData);

    expect(result.success).toBe(true);

    expect(result.message).toBe("آگهی با موفقیت ایجاد شد.");

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
      amenities: ["پارکینگ", "آسانسور"],
      rules: ["بدون حیوان خانگی"],
      images: validImages,
      price: 5000000000,
    });
  });

  it("should return the created ad in data", async () => {
    const createdAd = {
      id: "ad-1",
      name: "آپارتمان ۱۲۰ متری",
      transactionType: "buy",
      images: validImages,
    };

    mockedCreateAd.mockResolvedValue(createdAd as never);

    const result = await createAdAction(previousState, validFormData());

    expect(result.success).toBe(true);

    expect(result.data).toEqual(createdAd);
  });

  it("should return service error", async () => {
    mockedCreateAd.mockRejectedValue(new Error("خطا در ایجاد آگهی"));

    const result = await createAdAction(previousState, validFormData());

    expect(result.success).toBe(false);

    expect(result.message).toBe("خطا در ایجاد آگهی");

    expect(result.errors).toEqual({});
  });

  it("should not call createAd when validation fails", async () => {
    const formData = validFormData({
      transactionType: "invalid",
    });

    const result = await createAdAction(previousState, formData);

    expect(result.success).toBe(false);

    expect(mockedCreateAd).not.toHaveBeenCalled();
  });

  it("should pass validated rent data to createAd", async () => {
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

    await createAdAction(previousState, formData);

    expect(mockedCreateAd).toHaveBeenCalledWith(
      expect.objectContaining({
        transactionType: "rent",
        deposit: 500000000,
        rent: 15000000,
      }),
    );

    const data = mockedCreateAd.mock.calls[0][0];

    expect(data).not.toHaveProperty("price");
  });
});
